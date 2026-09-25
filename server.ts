import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper function to execute Gemini calls with automatic retry and model fallback for 503/capacity spikes
async function generateWithRetryAndFallback(params: any): Promise<any> {
  const fallbackModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
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

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Analyze Image endpoint (OCR + Factory / Brand detection + Visual Specs Extraction)
app.post('/api/analyze-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', userPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'صورة المنتج مطلوبة للتحليل (imageBase64 missing)' });
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
أنت خبير محترف ومحقق في كشف وتتبع المصانع والعلامات التجارية والمنتجات التجارية والجملة من الصور.
المهمة:
قم بتحليل الصورة المرفقة بدقة فائقة واستخراج جميع البيانات الممكنة للبحث عن الصور المماثلة، وصفحات المصنع على فيسبوك، وقنوات تليجرام للمصنع وموزعيه.

يرجى فحص ما يلي بعناية:
1. اسم المصنع أو اسم الشركة أو الورشة (بالعربية والإنجليزية إن وجد)، سواء كان مكتوباً على بطاقة السعر (Tag)، أو كرتونة التعبئة، أو شريط الرقبة، أو مطبوعاً على المنتج، أو مدمجاً في اللوجو.
2. اللوجو (الشعار): اسم الماركة في الشعار، وصف شكل الشعار، الرموز.
3. تفاصيل الاتصال المطبوعة: أرقام تليفونات، واتساب، عناوين مصانع (مثل: العاشر من رمضان، المحلة الكبرى، العتبة، الموسكي، القنطرة، الإسكندرية، شبرا الخيمة، تركيا، جوانزو، إلخ)، حسابات فيسبوك أو تليجرام المكتوبة.
4. كود الموديل / رقم القطعة / السيريال / رقم التصميم (Style/Model/Art No.).
5. تصنيف المنتج بدقة (ملابس حريمي، كاجوال رجالي، أطفال وبيبي، أحذية وكوتشيات، شنط ومصنوعات جلدية، لانجري وبيجامات، مفروشات، أدوات منزلية، إلكترونيات، إلخ).
6. المواصفات البصرية: الألوان، نوع القماش/الخامة، القصات، التفاصيل المميزة (تطريز، طباعة، أزرار، كول) لتسهيل العثور على نفس القطعة أو موديلات مماثلة.
7. تفاصيل بيع الجملة (السرية / الدستة / التكرار / المقاسات).
8. اقتراح استعلامات بحث قوية ومخصصة لـ:
   - البحث في صفحات فيسبوك (Facebook Pages)
   - البحث في مجموعات فيسبوك للجملة (Facebook Groups)
   - البحث في قنوات تليجرام للمصانع والمكاتب (Telegram Channels)
   - كلمات البحث البصري للمحركات (Google Lens / Reverse Search keywords)
${userPrompt ? `ملاحظة إضافية من المستخدم: ${userPrompt}` : ''}
`;

    const response = await generateWithRetryAndFallback({
      contents: {
        parts: [imagePart, { text: promptText }],
      },
      config: {
        systemInstruction: 'أنت نظام ذكي مخصص لتحليل صور المنتجات واستخراج بيانات المصانع والشعارات والرموز لتسهيل البحث على فيسبوك وتليجرام ومحركات البحث العكسي. أخرج البيانات دائماً بصيغة JSON وفق المخطط المطلوب.',
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
              description: 'عنوان وصفي للمنتج، مثال: عباية سوداء مطرزة كم فراشة كود 402',
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
                socialHandles: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'معرفات تليجرام أو فيسبوك المكتوبة' },
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
            searchQueries: {
              type: Type.OBJECT,
              properties: {
                facebookPageQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                facebookGroupQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                telegramQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
                reverseImageKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['facebookPageQueries', 'telegramQueries', 'reverseImageKeywords'],
            },
            summaryAr: {
              type: Type.STRING,
              description: 'ملخص تحليلي مكثف باللغة العربية لما تم العثور عليه في الصورة وتوجيه المستخدم لكيفية العثور على المصنع',
            },
          },
          required: [
            'factoryName',
            'productTitle',
            'productCategory',
            'fullOcrText',
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
        : error?.message || 'حدث خطأ أثناء فحص وتحليل الصورة.',
      isOverloaded,
    });
  }
});

// Grounded Search endpoint: performs live web & social search across Facebook & Telegram
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

    const searchQueryInstruction = `
قم بالبحث المباشر والمفصل عبر الإنترنت عن المصنع أو المنتج الآتي:
- اسم المصنع / العلامة التجارية: "${factoryName || 'غير محدد'}"
- عنوان أو نوع المنتج: "${productTitle || ''}"
- كود الموديل: "${modelCode || ''}"
- التصنيف: "${category || ''}"
- المنطقة / الدولة: "${location || 'مصر والوطن العربي'}"
${additionalKeywords ? `- كلمات إضافية: "${additionalKeywords}"` : ''}

الهدف الرئيسي للبحث:
1. البحث عن صفحات فيسبوك الخاصة بهذا المصنع (Facebook Pages / Profiles / Stores).
2. البحث عن مجموعات فيسبوك لجملة المصانع وتجار الجملة والمكاتب التي تعرض منتجات هذا المصنع.
3. البحث عن قنوات ومجموعات تليجرام (Telegram Channels / Groups t.me/...) المتخصصة في عرض موديلات هذا المصنع، مكاتب التوزيع، قنوات المصنع الرسمية، جروبات الجملة.
4. استخراج معلومات الاتصال المتاحة (أرقام هواتف، واتساب، عناوين المكاتب والمصانع، أسماء المسؤولين).
5. تقديم روابط حقيقية ومعلومات دقيقة مع ملخص واضح ومفيد للتاجر والمشتري.

يرجى إخراج النتائج بهيئة JSON منظمة ومطابقة للمخطط.
`;

    const response = await generateWithRetryAndFallback({
      contents: searchQueryInstruction,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: 'أنت باحث خبير في سوق الجملة والمصانع وتجارة الملابس والمنتجات على فيسبوك وتليجرام. استخدم أداة البحث في جوجل للوصول إلى صفحات فيسبوك الحقيقية وقنوات تليجرام وروابط التواصل، وأعد الإجابة بأسلوب منظم جداً بصيغة JSON قابلة للقراءة.',
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
      actionTips: ['استخدم روابط البحث المباشرة بأعلى الصفحة لفحص فيسبوك وتليجرام مباشرة'],
    });

    // Extract grounding citations if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
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
    // Return graceful partial data so user can still see direct deep links to Facebook & Telegram
    return res.json({
      success: true,
      data: {
        factoryOverview: `بحث مباشر ومطابقة لمصنع ${req.body?.factoryName || ''}`,
        facebookFindings: [],
        telegramFindings: [],
        actionTips: ['يمكنك فتح محركات البحث المباشرة في فيسبوك وتليجرام بنقرة واحدة عبر الأزرار المتاحة'],
      },
      groundingSources: [],
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
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
