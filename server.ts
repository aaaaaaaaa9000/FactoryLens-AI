import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { installLogin } from './login';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.set('trust proxy', 1);
app.use(express.json({ limit: '15mb' }));

const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS || '1000', 10);
const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '10', 10);

// Health check (before auth and rate limit)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// In-page login form + session cookie, enabled only when APP_PASSWORD is set
installLogin(app, {
  appName: 'بصير المصانع',
  username: process.env.APP_USERNAME || 'user',
  password: process.env.APP_PASSWORD || '',
  accent: '#4f46e5',
});

// Per-IP rate limit on the AI endpoints
const hits = new Map<string, number[]>();
app.use('/api', (req: Request, res: Response, next) => {
  if (req.path === '/health') return next();
  const now = Date.now();
  const ip = req.ip || 'unknown';
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (recent.length >= RATE_LIMIT_PER_MINUTE) {
    return res.status(429).json({ error: 'طلبات كثيرة في وقت قصير، انتظر دقيقة وحاول مرة أخرى.' });
  }
  recent.push(now);
  hits.set(ip, recent);
  next();
});
setInterval(() => {
  const now = Date.now();
  for (const [ip, ts] of hits) if (ts.every((t) => now - t >= 60_000)) hits.delete(ip);
}, 5 * 60_000).unref();

const tooLong = (...vals: unknown[]) => vals.some((v) => typeof v === 'string' && v.length > MAX_INPUT_CHARS);

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to execute Gemini calls with automatic retry and model fallback for 503/capacity spikes
async function generateWithRetryAndFallback(params: any): Promise<any> {
  const fallbackModels = (process.env.GEMINI_MODEL || process.env.GEMINI_MODELS || 'gemini-3.8-flash,gemini-flash-latest,gemini-2.5-flash')
    .split(',').map((m) => m.trim()).filter(Boolean);
  let lastError: any = null;

  for (const modelName of fallbackModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errStr = err?.message || JSON.stringify(err);
        const isTransientError =
          errStr.includes('503') ||
          errStr.includes('UNAVAILABLE') ||
          errStr.includes('high demand') ||
          errStr.includes('RESOURCE_EXHAUSTED') ||
          errStr.includes('429');

        if (isTransientError) {
          console.warn(
            `Model ${modelName} (attempt ${attempt + 1}) encountered transient error: ${errStr.slice(0, 120)}... Retrying...`
          );
          await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
          continue;
        } else {
          // If it's a client or syntax error, throw immediately
          throw err;
        }
      }
    }
  }

  throw lastError;
}

// Clean markdown fence from JSON text if present
function parseJsonSafely(rawText: string, fallbackObj: any = {}): any {
  if (!rawText) return fallbackObj;
  let text = rawText.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (text.startsWith('```')) {
    text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Failed to parse model JSON:', err, 'Raw text:', text.slice(0, 200));
    return fallbackObj;
  }
}

// Analyze Image endpoint (OCR + Factory / Brand detection + Visual Specs Extraction)
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'صورة المنتج مطلوبة للتحليل (imageBase64 missing)' });
    }

    if (tooLong(userPrompt)) {
      return res.status(400).json({ error: 'الملاحظة طويلة جداً.' });
    }

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const promptText = `
أنت كبير مهندسي الرؤية الحاسوبية وخبير استخبارات المصانع وتتبع سلاسل التوريد والمنتجات التجارية.
المهمة:
قم بتطبيق خوارزمية تحليل بصري فائقة الدقة ومقاومة للاختلافات (Lighting & Angle-Invariant Perceptual Matching) لتحليل الصورة المرفقة واستخراج جميع البيانات لربطها بالمصانع على فيسبوك، تليجرام، انستغرام، وتويتر (X)، ومحركات البحث العكسي.

قواعد خوارزمية التطابق البصري المقاوم للاختلافات:
1. دقة التعرف عبر الزوايا المختلفة (Perspective & Angle Invariance):
   - قم بالتعرف على الموديل والشعار حتى لو كانت الصورة ملتقطة من زاوية مائلة أو جانبية أو علوية.
   - قم باستخراج المعالم الهيكلية الثابتة (Silhouette & Structural geometry).
2. معالجة تشوهات الإضاءة والظلال (Lighting & Shadow Compensation):
   - قم بتمييز الألوان والخامات حتى لو كانت الصورة ذات إضاءة خافتة، أو إضاءة فلاش ساطعة، أو انعكاسات أكياس التغليف والنايلون.
3. التكبير والقص الجزئي (Scale & Cropping Tolerance):
   - التعرف على الموديل حتى لو كانت الصورة تظهر جزءاً فقط من القطعة أو تيكت السعر أو الكرتونة.
4. استخراج بيانات المصنع واللوجو والـ OCR:
   - اسم المصنع / الشركة / الورشة (عربي وإنجليزي).
   - اللوجو والرموز والعلامات المائية.
   - أكواد الموديلات (Style/Model/Art No.)، أرقام السيريال، أرقام هواتف وواتساب، العناوين الصناعية (العاشر من رمضان، المحلة، العتبة، 6 أكتوبر، شبرا، تركيا، جوانزو، إلخ).
5. توليد استعلامات مخصصة لمنصات التواصل:
   - فيسبوك (Facebook Pages & Groups)
   - تليجرام (Telegram Channels & Wholesalers)
   - انستغرام (Instagram Accounts, Reels, & Hashtags: حسابات معارض ومصانع، هاشتاج الموديل)
   - تويتر / إكس (Twitter/X Posts & Manufacturer Accounts)
   - استعلامات البحث العكسي المقاومة لتغير الزوايا والإضاءة (Multi-Angle Reverse Visual Search)
${userPrompt ? `ملاحظة إضافية من المستخدم: ${userPrompt}` : ''}
`;

    const response = await generateWithRetryAndFallback({
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        systemInstruction: 'أنت نظام متقدم للتحليل البصري الدقيق واستخراج بيانات المصانع والشعارات بدقة متناهية عبر منصات التواصل فيسبوك، تليجرام، انستغرام، وتويتر ومحركات البحث العكسي. أخرج البيانات دائماً بصيغة JSON وفق المخطط المطلوب.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            factoryName: {
              type: Type.STRING,
              description: 'اسم المصنع أو الشركة المكتوب على الصورة أو الشعار باللغة العربية أو الإنجليزية الأساسية',
            },
            factoryNameEn: {
              type: Type.STRING,
              description: 'الاسم بالحروف اللاتينية/الإنجليزية أو التعريب إن وجد',
            },
            confidence: {
              type: Type.STRING,
              description: 'مستوى الثقة في التعرف على المصنع: عالي (High)، متوسط (Medium)، غير مؤكد (Low)',
            },
            logoDetails: {
              type: Type.OBJECT,
              properties: {
                hasLogo: { type: Type.BOOLEAN },
                logoText: { type: Type.STRING, description: 'النص المكتوب داخل اللوجو' },
                description: { type: Type.STRING, description: 'وصف تصميم وأيقونة اللوجو' },
              },
              required: ['hasLogo'],
            },
            fullOcrText: {
              type: Type.STRING,
              description: 'كل النصوص والأرقام المطبوعة المقروءة في الصورة سطر بسطر',
            },
            productTitle: {
              type: Type.STRING,
              description: 'عنوان وصفي للمنتج، مثال: ترنج شتوي ميلتون مبطن كود 704',
            },
            productCategory: {
              type: Type.STRING,
              description: 'الفئة التجارية للمنتج',
            },
            modelCodes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'أكواد الموديلات، أرقام الموديل، الباركودات إن وجدت',
            },
            contactInfo: {
              type: Type.OBJECT,
              properties: {
                phones: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'أرقام الهواتف أو الواتساب المكتوبة' },
                addresses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'العناوين أو المدن أو المناطق المذكورة' },
                socialHandles: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'معرفات تليجرام أو فيسبوك أو انستغرام أو تويتر المكتوبة' },
              },
            },
            specs: {
              type: Type.OBJECT,
              properties: {
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'الخامات مثل قطن، ميلتون، كريب، جلد، إلخ' },
                sizes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'المقاسات المذكورة أو التقديرية' },
                wholesalePackaging: { type: Type.STRING, description: 'تفاصيل الدستة، السيرية، كرتونة الجملة' },
              },
            },
            visualFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'السمات البصرية المميزة للمنتج لمطابقة الصور المماثلة',
            },
            visualFingerprint: {
              type: Type.OBJECT,
              properties: {
                structuralSilhouette: { type: Type.STRING, description: 'التوصيف الهندسي للقصة والأبعاد المقاوم لزاوية التصوير' },
                colorPaletteInvariant: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'لوحة الألوان الأساسية بعد تصحيح تدرج الإضاءة والظلال' },
                textureAndFabricPattern: { type: Type.STRING, description: 'وصف دقيق لنسيج الخامة (تريكو، جينز، ميلتون، جلد، إلخ)' },
                invariantKeypoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'العلامات الثابتة غير المتأثرة بالزاوية أو الدوران' },
                lightingAndAngleToleranceNotes: { type: Type.STRING, description: 'ملاحظة تحليلية حول كيفية مقاومة الإضاءة أو الانعكاسات في الصورة' },
                robustSearchTokens: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'كلمات بحث بصرية محكمة' },
              },
              required: ['structuralSilhouette', 'colorPaletteInvariant', 'textureAndFabricPattern', 'invariantKeypoints'],
            },
            searchQueries: {
              type: Type.OBJECT,
              properties: {
                facebookPageQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                facebookGroupQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                telegramQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                instagramQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                twitterQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                reverseImageKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                multiAngleReverseQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['facebookPageQueries', 'telegramQueries', 'instagramQueries', 'twitterQueries', 'reverseImageKeywords'],
            },
            summaryAr: {
              type: Type.STRING,
              description: 'ملخص تحليلي مكثف باللغة العربية لما تم العثور عليه في الصورة وتوجيه المستخدم لكيفية العثور على المصنع عبر كافة المنصات',
            },
          },
          required: [
            'factoryName',
            'productTitle',
            'productCategory',
            'fullOcrText',
            'visualFingerprint',
            'searchQueries',
            'summaryAr',
          ],
        },
      },
    });

    const parsedData = parseJsonSafely(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    const errText = error?.message || '';
    const isOverloaded = errText.includes('503') || errText.includes('UNAVAILABLE') || errText.includes('high demand');
    return res.status(isOverloaded ? 503 : 500).json({
      error: isOverloaded
        ? 'سيرفرات الذكاء الاصطناعي تشهد ضغطاً مؤقتاً في هذه اللحظة. يرجى النقر على زر "إعادة المحاولة" بعد لحظات.'
        : 'حدث خطأ أثناء فحص وتحليل الصورة.',
      isOverloaded,
    });
  }
});

// Grounded Search endpoint: performs live web & social search across Facebook, Telegram, Instagram & Twitter (X)
app.post('/api/search-factory', async (req: Request, res: Response) => {
  try {
    const {
      factoryName,
      productTitle = '',
      modelCode = '',
      category = '',
      location = '',
      additionalKeywords = '',
    } = req.body;

    if (!factoryName && !productTitle && !modelCode) {
      return res.status(400).json({ error: 'يرجى تقديم اسم المصنع أو كود الموديل أو عنوان المنتج للبحث' });
    }

    if (tooLong(factoryName, productTitle, modelCode, category, location, additionalKeywords)) {
      return res.status(400).json({ error: 'أحد الحقول طويل جداً.' });
    }

    const searchQueryInstruction = `
قم بالبحث المباشر والمفصل عبر الإنترنت وشبكات التواصل عن المصنع أو المنتج الآتي:
- اسم المصنع / العلامة التجارية: "${factoryName || 'غير محدد'}"
- عنوان أو نوع المنتج: "${productTitle || ''}"
- كود الموديل: "${modelCode || ''}"
- التصنيف: "${category || ''}"
- المنطقة / الدولة: "${location || 'مصر والوطن العربي'}"
${additionalKeywords ? `- كلمات إضافية: "${additionalKeywords}"` : ''}

الهدف الرئيسي للبحث التفاعلي عبر منصات التواصل:
1. فيسبوك: البحث عن صفحات فيسبوك الخاصة بهذا المصنع (Facebook Pages) وجروبات تجار الجملة ومكاتب التوزيع.
2. تليجرام: البحث عن قنوات ومجموعات تليجرام (Telegram Channels / Groups t.me/...) المتخصصة في عرض موديلات هذا المصنع ومكاتب التوريد.
3. انستغرام (Instagram): البحث عن حسابات معارض ومصانع انستغرام (site:instagram.com) وهاشتاجات الموديل والصور والمقاطع المعروضة من المصنع.
4. تويتر / إكس (Twitter / X): البحث عن حسابات وتغريدات الموردين والمصانع (site:x.com OR site:twitter.com) وإعلانات كود القطعة وعروض التوريد.
5. استخراج معلومات الاتصال المتاحة (أرقام هواتف، واتساب، عناوين المكاتب والمصانع، أسماء المسؤولين، حسابات التواصل).
6. تقديم روابط حقيقية ومعلومات دقيقة مع ملخص واضح ومفيد للتاجر والمشتري.

يرجى إخراج النتائج بهيئة JSON منظمة ومطابقة للمخطط.
`;

    // Step 1: live Google Search grounding (tools cannot be combined with JSON schema mode reliably)
    const searchResponse = await generateWithRetryAndFallback({
      contents: searchQueryInstruction.replace('يرجى إخراج النتائج بهيئة JSON منظمة ومطابقة للمخطط.', 'اكتب النتائج كنص منظم مع الروابط الكاملة كما ظهرت في نتائج البحث. لا تخترع أي رابط أو رقم؛ إن لم تجد شيئاً اكتب أنك لم تجد.'),
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: 'أنت باحث خبير في سوق الجملة والمصانع وشبكات التواصل. استخدم بحث جوجل للوصول إلى الحسابات والصفحات والقنوات الحقيقية. اذكر فقط ما وجدته فعلاً في نتائج البحث ولا تخمّن روابط.',
      },
    });
    const searchText: string = searchResponse.text || '';

    // Step 2: structure the findings into JSON (no tools)
    const response = await generateWithRetryAndFallback({
      contents: `حوّل نتائج البحث التالية إلى JSON وفق المخطط. استخدم فقط الروابط والأرقام المذكورة نصاً في النتائج، واترك القوائم فارغة لو لم يوجد شيء. لا تضف أي رابط من عندك.\n\n${searchText}`,
      config: {
        systemInstruction: 'أنت منظّم بيانات دقيق. لا تخترع روابط أو أرقاماً.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            factoryOverview: {
              type: Type.STRING,
              description: 'نبذة عن المصنع أو العلامة التجارية وشهرتها ونشاطها التجاري وأماكن تواجدها',
            },
            facebookFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'عنوان الصفحة أو الجروب' },
                  url: { type: Type.STRING, description: 'الرابط المباشر لصفحة أو جروب فيسبوك' },
                  snippet: { type: Type.STRING, description: 'مقتطف مما تقدمه الصفحة أو الجروب' },
                  type: { type: Type.STRING, description: 'صفحة رسمية (Page) / جروب جملة (Group) / مكتب توزيع (Distributor)' },
                  phone: { type: Type.STRING, description: 'رقم هاتف أو واتساب مذكور إن وجد' },
                  location: { type: Type.STRING, description: 'المدينة أو العنوان إن ذكر' },
                },
                required: ['title', 'url', 'snippet', 'type'],
              },
            },
            telegramFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'اسم القناة أو الجروب' },
                  url: { type: Type.STRING, description: 'رابط القناة (مثل https://t.me/...) أو معرفها' },
                  username: { type: Type.STRING, description: 'معرف القناة @username إن وجد' },
                  snippet: { type: Type.STRING, description: 'وصف المحتوى وموديلات المصنع المعروضة' },
                  category: { type: Type.STRING, description: 'قناة مصنع / مكتب جملة / وسيط' },
                },
                required: ['title', 'url', 'snippet'],
              },
            },
            instagramFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'اسم الحساب أو المنشور' },
                  url: { type: Type.STRING, description: 'رابط حساب انستغرام أو الهاشتاج' },
                  username: { type: Type.STRING, description: 'يوزرنيم الحساب @username' },
                  snippet: { type: Type.STRING, description: 'وصف الحساب أو الموديل المعروض والبيو' },
                  followersHint: { type: Type.STRING, description: 'ملاحظة حول النشاط أو المتابعين' },
                  accountType: { type: Type.STRING, description: 'حساب مصنع رسمي / معرض منتجات / متجر جملة' },
                },
                required: ['title', 'url', 'snippet'],
              },
            },
            twitterFindings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: 'عنوان التغريدة أو الحساب' },
                  url: { type: Type.STRING, description: 'رابط التغريدة أو البروفايل على X/Twitter' },
                  handle: { type: Type.STRING, description: 'معرف الحساب @handle' },
                  snippet: { type: Type.STRING, description: 'نص التغريدة أو الإعلان وموديل المصنع' },
                  postDate: { type: Type.STRING, description: 'تاريخ أو حداثة المنشور' },
                  relevance: { type: Type.STRING, description: 'إعلان توريد / حساب مصنع / صفقات' },
                },
                required: ['title', 'url', 'snippet'],
              },
            },
            otherWholesaleSources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  platform: { type: Type.STRING, description: 'الموقع أو المنصة أو الدليل التجاري' },
                  snippet: { type: Type.STRING },
                },
                required: ['title', 'url', 'platform', 'snippet'],
              },
            },
            contactDirectory: {
              type: Type.OBJECT,
              properties: {
                phones: { type: Type.ARRAY, items: { type: Type.STRING } },
                whatsapps: { type: Type.ARRAY, items: { type: Type.STRING } },
                knownAddresses: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            actionTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'نصائح ذكية للوصول لأفضل سعر وتفادي الوسطاء والتحقق من مصداقية المصنع',
            },
          },
          required: [
            'factoryOverview',
            'facebookFindings',
            'telegramFindings',
            'actionTips',
          ],
        },
      },
    });

    const parsedResults = parseJsonSafely(response.text || '{}', {
      factoryOverview: `معلومات وبحث مباشر عن منتجات ومصنع ${factoryName || ''}`,
      facebookFindings: [],
      telegramFindings: [],
      instagramFindings: [],
      twitterFindings: [],
      actionTips: ['استخدم روابط البحث المباشرة بأعلى الصفحة لفحص فيسبوك وتليجرام وانستغرام وتويتر مباشرة'],
    });

    // Keep only links that point to the expected platform AND appear in the real search text
    const hostOk = (u: string, hosts: string[]) => {
      try {
        const h = new URL(u).hostname.replace(/^www\./, '');
        return hosts.some((x) => h === x || h.endsWith('.' + x));
      } catch {
        return false;
      }
    };
    const normalize = (u: string) => u.replace(/[\/?#]+$/, '');
    const inText = (u: string) => searchText.includes(normalize(u));
    const clean = (list: any, hosts: string[]) =>
      (Array.isArray(list) ? list : [])
        .filter((f: any) => f?.url && hostOk(f.url, hosts) && inText(f.url))
        .map((f: any) => ({ ...f, verified: true }));
    parsedResults.facebookFindings = clean(parsedResults.facebookFindings, ['facebook.com', 'fb.com', 'fb.me']);
    parsedResults.telegramFindings = clean(parsedResults.telegramFindings, ['t.me', 'telegram.me', 'telegram.org']);
    parsedResults.instagramFindings = clean(parsedResults.instagramFindings, ['instagram.com']);
    parsedResults.twitterFindings = clean(parsedResults.twitterFindings, ['x.com', 'twitter.com']);
    parsedResults.otherWholesaleSources = (Array.isArray(parsedResults.otherWholesaleSources) ? parsedResults.otherWholesaleSources : []).filter(
      (f: any) => f?.url && /^https?:\/\//.test(f.url) && inText(f.url)
    );

    // Extract grounding citations if available
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || chunk.web.uri,
        uri: chunk.web.uri,
      }));

    return res.json({
      success: true,
      data: parsedResults,
      groundingSources: webSources,
    });
  } catch (error: any) {
    console.error('Error searching factory:', error);
    return res.status(502).json({
      success: false,
      error: 'فشل البحث المباشر على الإنترنت. يمكنك استخدام روابط البحث اليدوي أو إعادة المحاولة.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use('/assets', express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }));
    app.use(express.static(distPath, { index: false }));
    app.get('*', (_req: Request, res: Response) => {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
