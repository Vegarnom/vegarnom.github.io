/**
 * aivan.vn - Landing Page Application
 * Optimized with security and performance fixes
 *
 * SETUP INSTRUCTIONS:
 * ==================
 *
 * 1. Formspree Setup:
 *    - Tạo account tại https://formspree.io
 *    - Tạo 3 forms: consultation, newsletter, quick_contact
 *    - Copy form IDs vào FORMSPREE_ENDPOINTS bên dưới
 *
 * 2. Google Sheets Setup:
 *    - Tạo Google Sheet mới
 *    - Mở Extensions > Apps Script
 *    - Copy code từ file google-apps-script.js (nếu có)
 *    - Deploy as Web App
 *    - Copy URL vào GOOGLE_SHEETS_URL
 *
 * 3. Google Analytics:
 *    - Thay GA_MEASUREMENT_ID trong index.html
 *    - Thay YOUR_GA_ID ở dòng ~12
 *
 * 4. Facebook Pixel (optional):
 *    - Thêm Facebook Pixel code vào index.html
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        STORAGE_KEY: 'aivan_selectedIndustry',
        ANALYTICS_ID: 'G-XXXXXXXXXX', // Replace with your actual GA4 Measurement ID
        DEFAULT_PAGE: 'home',
        AVAILABLE_PAGES: ['home', 'services', 'results'],
        AVAILABLE_INDUSTRIES: ['programming', 'trading', 'personal-assistant'],

        // Formspree Configuration
        // Tạo account tại https://formspree.io và thay thế các ID bên dưới
        FORMSPREE: {
            consultation: 'https://formspree.io/f/YOUR_FORM_ID',
            newsletter: 'https://formspree.io/f/YOUR_FORM_ID',
            quick: 'https://formspree.io/f/YOUR_FORM_ID'
        },

        // Google Sheets Web App URL
        // Xem hướng dẫn setup trong SETUP_INSTRUCTIONS ở đầu file
        GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
    };

    // ============================================
    // DATA LAYER - Phase 1 (Lazy Loaded)
    // ============================================


    /**
     * INDUSTRIES_DATA - 3 ngành với essential/recommended/optional tools
     * Mỗi ngành có workflows với primaryTool và supportingTools
     */
    const INDUSTRIES_DATA = {
        programming: {
            id: 'programming',
            name: 'Lập trình',
            subtitle: 'Developer, Freelancer, Tech Team',
            icon: 'code',
            gradient: 'from-[#667eea] to-[#764ba2]',
            description: 'AI hỗ trợ code generation, review, debug và documentation tự động',

            essentialTools: ['cursor', 'githubcopilot', 'claude'],
            recommendedTools: ['codeium', 'chatgpt', 'tabnine'],
            optionalTools: ['gemini', 'canvaai'],

            workflows: [
                {
                    step: 1,
                    title: 'Code Generation',
                    description: 'Từ requirements → code với AI pair programming, autocomplete thông minh',
                    primaryTool: 'cursor',
                    supportingTools: ['githubcopilot', 'claude'],
                    icon: 'code',
                    color: '#ec6d13'
                },
                {
                    step: 2,
                    title: 'Code Review & Debug',
                    description: 'AI review code, phát hiện bugs, security scan, đề xuất fixes',
                    primaryTool: 'claude',
                    supportingTools: ['codeium', 'chatgpt'],
                    icon: 'rate_review',
                    color: '#60a5fa'
                },
                {
                    step: 3,
                    title: 'Documentation',
                    description: 'Auto-generate docs, API reference, README, inline comments',
                    primaryTool: 'chatgpt',
                    supportingTools: ['cursor', 'claude'],
                    icon: 'description',
                    color: '#ec4899'
                }
            ],

            stats: {
                efficiency: '+300%',
                timeSaved: '4-6h',
                roi: 'x5.0',
                description: 'Code nhanh hơn 3-5x, giảm 50% bugs, tăng chất lượng documentation'
            }
        },

        trading: {
            id: 'trading',
            name: 'Trading',
            subtitle: 'Crypto, Forex, Chứng khoán',
            icon: 'candlestick_chart',
            gradient: 'from-[#f093fb] to-[#f5576c]',
            description: 'AI phân tích thị trường, tạo signals, quản lý rủi ro và automated trading',

            essentialTools: ['tradingview', '3commas', 'claude'],
            recommendedTools: ['tickeron', 'chatgpt', 'quantconnect'],
            optionalTools: ['gemini', 'powerbi'],

            workflows: [
                {
                    step: 1,
                    title: 'Phân tích thị trường',
                    description: 'Technical analysis, sentiment analysis, pattern recognition với AI',
                    primaryTool: 'tradingview',
                    supportingTools: ['claude', 'tickeron'],
                    icon: 'analytics',
                    color: '#ec6d13'
                },
                {
                    step: 2,
                    title: 'Tín hiệu giao dịch',
                    description: 'AI tạo entry/exit signals, multi-timeframe analysis, probability scoring',
                    primaryTool: '3commas',
                    supportingTools: ['tickeron', 'tradingview'],
                    icon: 'trending_up',
                    color: '#60a5fa'
                },
                {
                    step: 3,
                    title: 'Quản lý rủi ro',
                    description: 'Position sizing, stop-loss optimization, portfolio balancing với AI',
                    primaryTool: 'quantconnect',
                    supportingTools: ['tradingview', 'claude'],
                    icon: 'shield',
                    color: '#ec4899'
                }
            ],

            stats: {
                efficiency: '+65%',
                timeSaved: '3h',
                roi: 'x3.5',
                description: 'Win rate 65-75%, giảm drawdown 40%, phân tích nhanh hơn 5x'
            }
        },

        'personal-assistant': {
            id: 'personal-assistant',
            name: 'Trợ lý cá nhân',
            subtitle: 'Productivity, Life Management',
            icon: 'assistant',
            gradient: 'from-[#a8edea] to-[#fed6e3]',
            description: 'AI quản lý lịch, ghi chú cuộc họp, tổ chức kiến thức và tự động hóa công việc',

            essentialTools: ['notionai', 'otterai', 'claude'],
            recommendedTools: ['reclaimai', 'chatgpt', 'perplexity'],
            optionalTools: ['gemini', 'canvaai', 'vbee'],

            workflows: [
                {
                    step: 1,
                    title: 'Lên lịch thông minh',
                    description: 'AI tối ưu calendar, protect focus time, auto-schedule tasks và habits',
                    primaryTool: 'reclaimai',
                    supportingTools: ['gemini', 'notionai'],
                    icon: 'calendar_month',
                    color: '#ec6d13'
                },
                {
                    step: 2,
                    title: 'Ghi chú cuộc họp',
                    description: 'Transcription real-time, AI summary, extract action items tự động',
                    primaryTool: 'otterai',
                    supportingTools: ['notionai', 'claude'],
                    icon: 'mic',
                    color: '#60a5fa'
                },
                {
                    step: 3,
                    title: 'Quản lý kiến thức',
                    description: 'AI organize notes, semantic search, synthesize information từ nhiều nguồn',
                    primaryTool: 'notionai',
                    supportingTools: ['perplexity', 'claude'],
                    icon: 'psychology',
                    color: '#ec4899'
                }
            ],

            stats: {
                efficiency: '+50%',
                timeSaved: '2.5h',
                roi: 'x4.0',
                description: 'Tiết kiệm 2-3h/ngày, không miss action items, knowledge at fingertips'
            }
        }
    };

    /**
     * TOOLS_DATA - 30 công cụ AI với đầy đủ metadata
     */
    const TOOLS_DATA = {
        // ========== A. FOUNDATION MODELS ==========
        chatgpt: {
            id: 'chatgpt',
            name: 'ChatGPT',
            provider: 'OpenAI',
            category: 'foundation',
            icon: 'chat',
            color: '#10a37f',
            description: 'Mô hình ngôn ngữ lớn hàng đầu cho tư vấn, soạn thảo và phân tích',
            features: ['Chatbot thông minh', 'Phân tích tài liệu', 'Code assistant', 'API tích hợp'],
            useCases: ['CSKH', 'Content creation', 'Data analysis', 'Automation'],
            pricing: 'Freemium ($20/tháng cho Plus)',
            website: 'https://chat.openai.com',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        claude: {
            id: 'claude',
            name: 'Claude',
            provider: 'Anthropic',
            category: 'foundation',
            icon: 'psychology',
            color: '#cc785c',
            description: 'AI assistant với khả năng xử lý context dài (200K tokens), an toàn và đáng tin cậy',
            features: ['200K context window', 'Phân tích & lý luận', 'Code generation', 'Document Q&A'],
            useCases: ['Research', 'Legal analysis', 'Long-form content', 'Data processing'],
            pricing: 'Freemium ($20/tháng)',
            website: 'https://claude.ai',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        gemini: {
            id: 'gemini',
            name: 'Google Gemini',
            provider: 'Google',
            category: 'foundation',
            icon: 'stars',
            color: '#4285f4',
            description: 'Multimodal AI từ Google, tích hợp sâu với Google Workspace',
            features: ['Multimodal (text, image, video)', 'Google Workspace integration', 'Real-time search', 'Code execution'],
            useCases: ['Workspace automation', 'Content creation', 'Research', 'Development'],
            pricing: 'Freemium ($20/tháng)',
            website: 'https://gemini.google.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== B. AI VIỆT NAM ==========
        misaaai: {
            id: 'misaaai',
            name: 'MISA AMIS OneAI',
            provider: 'MISA',
            category: 'vietnam',
            icon: 'account_balance',
            color: '#0066cc',
            description: 'Nền tảng AI tổng thể cho doanh nghiệp Việt Nam, tích hợp ERP',
            features: ['Chatbot nội bộ', 'Tự động hóa quy trình', 'Phân tích dữ liệu', 'Voice AI'],
            useCases: ['ERP integration', 'HR automation', 'Customer service', 'Document processing'],
            pricing: 'Subscription (liên hệ)',
            website: 'https://amis.misa.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        fptai: {
            id: 'fptai',
            name: 'FPT.AI',
            provider: 'FPT',
            category: 'vietnam',
            icon: 'memory',
            color: '#00a651',
            description: 'Bộ công cụ AI toàn diện: OCR, Chatbot, Speech, Vision',
            features: ['OCR/Document Reader', 'Chatbot platform', 'Text-to-Speech', 'Speech-to-Text', 'Computer Vision'],
            useCases: ['Document digitization', 'Customer support', 'Voice applications', 'KYC'],
            pricing: 'Pay-per-use',
            website: 'https://fpt.ai',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        zaloai: {
            id: 'zaloai',
            name: 'Zalo AI',
            provider: 'VNG',
            category: 'vietnam',
            icon: 'chat_bubble',
            color: '#0068ff',
            description: 'AI platform tích hợp với hệ sinh thái Zalo (90M+ users)',
            features: ['Zalo Chatbot', 'Zalo OA automation', 'Voice AI', 'NLP APIs'],
            useCases: ['Social commerce', 'Customer engagement', 'Broadcast messaging', 'Lead generation'],
            pricing: 'Freemium',
            website: 'https://zalo.ai',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        vinai: {
            id: 'vinai',
            name: 'VinAI',
            provider: 'Vingroup',
            category: 'vietnam',
            icon: 'biotech',
            color: '#1e88e5',
            description: 'Nghiên cứu AI hàng đầu VN: PhoBERT, VinBrain, Medical AI',
            features: ['PhoBERT (NLP)', 'Face recognition', 'Medical imaging', 'Autonomous driving'],
            useCases: ['Healthcare AI', 'Security systems', 'Smart city', 'Research'],
            pricing: 'Enterprise',
            website: 'https://vinai.io',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        vbee: {
            id: 'vbee',
            name: 'Vbee AIVoice',
            provider: 'Vbee',
            category: 'vietnam',
            icon: 'record_voice_over',
            color: '#ff6b35',
            description: 'Giải pháp Text-to-Speech tiếng Việt tự nhiên nhất',
            features: ['Vietnamese TTS', 'Multiple voices', 'Voice cloning', 'API integration'],
            useCases: ['IVR systems', 'E-learning', 'Content narration', 'Accessibility'],
            pricing: 'Pay-per-use',
            website: 'https://vbee.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        // ========== C. CHATBOT & CUSTOMER SERVICE ==========
        botstar: {
            id: 'botstar',
            name: 'BotStar',
            provider: 'BotStar Vietnam',
            category: 'chatbot',
            icon: 'smart_toy',
            color: '#6366f1',
            description: 'Nền tảng chatbot đa kênh không cần code',
            features: ['Visual flow builder', 'Multi-channel', 'Live chat handover', 'Analytics'],
            useCases: ['Website chat', 'Facebook Messenger', 'Zalo OA', 'Customer support'],
            pricing: 'Freemium ($15/tháng)',
            website: 'https://botstar.com',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        stringee: {
            id: 'stringee',
            name: 'Stringee',
            provider: 'Stringee Vietnam',
            category: 'chatbot',
            icon: 'phone_in_talk',
            color: '#00bcd4',
            description: 'Nền tảng Contact Center và Communication APIs',
            features: ['Voice call API', 'Video call', 'SMS/Viber/Zalo messaging', 'Call center'],
            useCases: ['Customer support', 'Telemedicine', 'Sales calls', 'Verification'],
            pricing: 'Pay-per-use',
            website: 'https://stringee.com',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        freshchat: {
            id: 'freshchat',
            name: 'Freshchat',
            provider: 'Freshworks',
            category: 'chatbot',
            icon: 'support_agent',
            color: '#ff6b6b',
            description: 'Omnichannel customer messaging với AI chatbot Freddy',
            features: ['AI chatbot', 'Omnichannel inbox', 'Proactive messaging', 'Bot-to-agent handover'],
            useCases: ['Customer support', 'Sales engagement', 'Marketing automation'],
            pricing: 'Freemium ($19/tháng)',
            website: 'https://freshworks.com/live-chat-software',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== D. COMPUTER VISION & OCR ==========
        cvs: {
            id: 'cvs',
            name: 'CVS',
            provider: 'Computer Vision Vietnam',
            category: 'vision',
            icon: 'visibility',
            color: '#9c27b0',
            description: 'Giải pháp thị giác máy tính cho doanh nghiệp VN',
            features: ['Face recognition', 'Object detection', 'License plate recognition', 'Behavior analysis'],
            useCases: ['Access control', 'Retail analytics', 'Security', 'Smart parking'],
            pricing: 'Enterprise',
            website: 'https://computer-vision.vn',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        lacvietocr: {
            id: 'lacvietocr',
            name: 'Lạc Việt OCR',
            provider: 'Lạc Việt',
            category: 'vision',
            icon: 'document_scanner',
            color: '#e91e63',
            description: 'Nhận dạng ký tự tiếng Việt chuyên nghiệp',
            features: ['Vietnamese OCR', 'Handwriting recognition', 'ID card scanning', 'Invoice processing'],
            useCases: ['Document digitization', 'Form processing', 'KYC', 'Accounting'],
            pricing: 'License',
            website: 'https://lacviet.com.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        googlevision: {
            id: 'googlevision',
            name: 'Google Cloud Vision',
            provider: 'Google Cloud',
            category: 'vision',
            icon: 'image_search',
            color: '#4285f4',
            description: 'Cloud-based image analysis với machine learning',
            features: ['Label detection', 'OCR đa ngôn ngữ', 'Face detection', 'Object localization'],
            useCases: ['Content moderation', 'Cataloging', 'Document processing', 'Visual search'],
            pricing: 'Pay-per-use ($1.50/1000 images)',
            website: 'https://cloud.google.com/vision',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== E. CRM & MARKETING AUTOMATION ==========
        hubspot: {
            id: 'hubspot',
            name: 'HubSpot CRM + AI',
            provider: 'HubSpot',
            category: 'crm',
            icon: 'hub',
            color: '#ff7a59',
            description: 'CRM platform với AI-powered sales và marketing',
            features: ['Predictive lead scoring', 'Email automation', 'Content assistant', 'Chatbot builder'],
            useCases: ['Inbound marketing', 'Sales automation', 'Customer service'],
            pricing: 'Freemium ($50/tháng)',
            website: 'https://hubspot.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        salesforce: {
            id: 'salesforce',
            name: 'Salesforce Einstein',
            provider: 'Salesforce',
            category: 'crm',
            icon: 'cloud',
            color: '#00a1e0',
            description: 'AI layer tích hợp trong Salesforce CRM',
            features: ['Predictive analytics', 'Next best action', 'Automated insights', 'Natural language queries'],
            useCases: ['Sales forecasting', 'Lead prioritization', 'Service automation'],
            pricing: 'Enterprise ($75/tháng)',
            website: 'https://salesforce.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        crmviet: {
            id: 'crmviet',
            name: 'CrmViet',
            provider: 'CrmViet',
            category: 'crm',
            icon: 'people',
            color: '#ff5722',
            description: 'CRM made in Vietnam cho SME',
            features: ['Contact management', 'Sales pipeline', 'Marketing automation', 'Customer support'],
            useCases: ['Sales management', 'Customer tracking', 'Email marketing'],
            pricing: 'Subscription (200k/tháng)',
            website: 'https://crmviet.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        zohocrm: {
            id: 'zohocrm',
            name: 'Zoho CRM Plus',
            provider: 'Zoho',
            category: 'crm',
            icon: 'groups',
            color: '#ff7043',
            description: 'Unified CRM platform với AI assistant Zia',
            features: ['Zia AI assistant', 'Sales automation', 'Omnichannel communication', 'Analytics'],
            useCases: ['Sales management', 'Marketing automation', 'Customer support'],
            pricing: 'Subscription ($50/tháng)',
            website: 'https://zoho.com/crm',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        basecrm: {
            id: 'basecrm',
            name: 'Base CRM',
            provider: 'FPT',
            category: 'crm',
            icon: 'foundation',
            color: '#1976d2',
            description: 'CRM platform từ FPT cho thị trường VN',
            features: ['Lead management', 'Sales automation', 'Customer service', 'Mobile app'],
            useCases: ['B2B sales', 'Real estate', 'Retail'],
            pricing: 'Subscription (liên hệ)',
            website: 'https://base.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        // ========== F. E-COMMERCE & RETAIL AI ==========
        kiotviet: {
            id: 'kiotviet',
            name: 'KiotViet AI',
            provider: 'Citigo',
            category: 'ecommerce',
            icon: 'store',
            color: '#4caf50',
            description: 'Quản lý bán hàng tích hợp AI cho retail',
            features: ['Sales forecasting', 'Inventory optimization', 'Customer insights', 'Omnichannel sales'],
            useCases: ['Retail stores', 'Restaurants', 'F&B chains'],
            pricing: 'Subscription (150k/tháng)',
            website: 'https://kiotviet.vn',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        haravan: {
            id: 'haravan',
            name: 'Haravan AI',
            provider: 'Haravan',
            category: 'ecommerce',
            icon: 'shopping_bag',
            color: '#2196f3',
            description: 'E-commerce platform với AI-powered features',
            features: ['Product recommendations', 'Abandoned cart recovery', 'Customer segmentation'],
            useCases: ['Online stores', 'Omnichannel retail', 'Dropshipping'],
            pricing: 'Subscription (299k/tháng)',
            website: 'https://haravan.com',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: true
        },

        marketplaceai: {
            id: 'marketplaceai',
            name: 'Shopee/Lazada/Tiki AI',
            provider: 'Marketplaces',
            category: 'ecommerce',
            icon: 'local_mall',
            color: '#ee4d2d',
            description: 'AI tools tích hợp sẵn trong các sàn TMĐT',
            features: ['Auto pricing', 'Product recommendations', 'Search optimization', 'Ad automation'],
            useCases: ['Online selling', 'Marketplace optimization', 'Ad campaigns'],
            pricing: 'Platform fees',
            website: 'https://shopee.vn/edu',
            vietnameseSupport: 'Xuất sắc',
            apiAvailable: false
        },

        // ========== G. AGRICULTURE & LOGISTICS ==========
        fptsmartfarm: {
            id: 'fptsmartfarm',
            name: 'FPT Smart Farm',
            provider: 'FPT',
            category: 'agriculture',
            icon: 'agriculture',
            color: '#8bc34a',
            description: 'Giải pháp nông nghiệp thông minh với IoT và AI',
            features: ['Crop monitoring', 'Disease detection', 'Yield prediction', 'Automated irrigation'],
            useCases: ['Smart farming', 'Greenhouse management', 'Crop protection'],
            pricing: 'Enterprise',
            website: 'https://fpt.com/smart-agri',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        viettelpostai: {
            id: 'viettelpostai',
            name: 'ViettelPost AI',
            provider: 'Viettel',
            category: 'logistics',
            icon: 'local_shipping',
            color: '#ff9800',
            description: 'AI cho logistics và giao hàng thông minh',
            features: ['Route optimization', 'Delivery prediction', 'Warehouse automation', 'Demand forecasting'],
            useCases: ['Last-mile delivery', 'Warehouse management', 'Fleet optimization'],
            pricing: 'Enterprise',
            website: 'https://viettelpost.com.vn',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        // ========== H. CONTENT & CREATIVE AI ==========
        midjourney: {
            id: 'midjourney',
            name: 'Midjourney / DALL-E / SD',
            provider: 'Various',
            category: 'creative',
            icon: 'palette',
            color: '#1a1a2e',
            description: 'AI image generation từ text prompts',
            features: ['Photorealistic images', 'Art generation', 'Style transfer', 'Image editing'],
            useCases: ['Marketing visuals', 'Product mockups', 'Social media content'],
            pricing: 'Subscription ($10-60/tháng)',
            website: 'https://midjourney.com',
            vietnameseSupport: 'Không',
            apiAvailable: true
        },

        canvaai: {
            id: 'canvaai',
            name: 'Canva AI',
            provider: 'Canva',
            category: 'creative',
            icon: 'design_services',
            color: '#00c4cc',
            description: 'Design platform với AI-powered tools',
            features: ['Magic Design', 'Text to Image', 'Magic Edit', 'Brand Kit', 'AI Writer'],
            useCases: ['Social media graphics', 'Presentations', 'Marketing materials'],
            pricing: 'Freemium ($13/tháng)',
            website: 'https://canva.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        copyai: {
            id: 'copyai',
            name: 'Copy.ai / Jasper',
            provider: 'Various',
            category: 'creative',
            icon: 'edit_note',
            color: '#6366f1',
            description: 'AI copywriting và content generation',
            features: ['Blog writing', 'Ad copy', 'Email templates', 'Social media posts'],
            useCases: ['Content marketing', 'Ad campaigns', 'Email marketing'],
            pricing: 'Subscription ($36/tháng)',
            website: 'https://copy.ai',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== I. DATA ANALYTICS & BI ==========
        powerbi: {
            id: 'powerbi',
            name: 'Power BI + Copilot',
            provider: 'Microsoft',
            category: 'analytics',
            icon: 'insert_chart',
            color: '#f2c811',
            description: 'Business intelligence với AI-powered insights',
            features: ['Natural language queries', 'Automated insights', 'Predictive analytics', 'Copilot integration'],
            useCases: ['Dashboard creation', 'Report automation', 'Data visualization'],
            pricing: 'Subscription ($20/tháng)',
            website: 'https://powerbi.microsoft.com',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        tableau: {
            id: 'tableau',
            name: 'Tableau AI',
            provider: 'Salesforce',
            category: 'analytics',
            icon: 'analytics',
            color: '#e97627',
            description: 'Data visualization platform với AI features',
            features: ['Ask Data (NLP)', 'Explain Data', 'Einstein Discovery', 'Auto forecasting'],
            useCases: ['Data exploration', 'Visual analytics', 'Business intelligence'],
            pricing: 'Subscription ($70/tháng)',
            website: 'https://tableau.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        looker: {
            id: 'looker',
            name: 'Google Looker Studio',
            provider: 'Google',
            category: 'analytics',
            icon: 'bar_chart',
            color: '#4285f4',
            description: 'Free BI tool với Google ecosystem integration',
            features: ['Custom dashboards', 'Data blending', 'Automated reports', 'Google data connectors'],
            useCases: ['Marketing analytics', 'Website analytics', 'Custom reporting'],
            pricing: 'Freemium',
            website: 'https://lookerstudio.google.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== J. DEVELOPMENT TOOLS ==========
        githubcopilot: {
            id: 'githubcopilot',
            name: 'GitHub Copilot',
            provider: 'GitHub (Microsoft)',
            category: 'development',
            icon: 'code',
            color: '#000000',
            description: 'AI pair programmer gợi ý code và functions trong thời gian thực',
            features: ['Real-time code completions', 'Multi-line generation', 'Chat interface', 'CLI integration', '10+ ngôn ngữ'],
            useCases: ['Auto-complete code', 'Generate boilerplate', 'Explain code', 'Refactoring'],
            pricing: '$10/tháng (Individual), $19/user/tháng (Business)',
            website: 'https://github.com/features/copilot',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        cursor: {
            id: 'cursor',
            name: 'Cursor IDE',
            provider: 'Anysphere Inc.',
            category: 'development',
            icon: 'terminal',
            color: '#7c3aed',
            description: 'AI-first code editor với multi-file editing và autonomous agents',
            features: ['Composer multi-file edits', 'Codebase-aware chat', 'Tab autocomplete', 'Agent mode', 'VSCode extensions'],
            useCases: ['Large-scale refactoring', 'Feature from description', 'Debug với AI', 'Learn new codebase'],
            pricing: 'Free (Hobby), $20/tháng (Pro), $40/user/tháng (Business)',
            website: 'https://cursor.sh',
            vietnameseSupport: 'Khá',
            apiAvailable: false
        },

        codeium: {
            id: 'codeium',
            name: 'Codeium',
            provider: 'Exafunction Inc.',
            category: 'development',
            icon: 'bolt',
            color: '#09b6a2',
            description: 'Free AI coding toolkit với autocomplete, chat và search',
            features: ['Unlimited free autocomplete', 'Codebase-aware search', '70+ languages', '40+ IDEs', 'Windsurf IDE'],
            useCases: ['Free AI coding', 'Multi-language projects', 'Team onboarding', 'Agentic workflows'],
            pricing: 'Free (Individual), $12/user/tháng (Teams)',
            website: 'https://codeium.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        tabnine: {
            id: 'tabnine',
            name: 'Tabnine',
            provider: 'Tabnine Ltd.',
            category: 'development',
            icon: 'memory',
            color: '#ca2b7e',
            description: 'AI code assistant với privacy-focused on-premise deployment',
            features: ['Whole-line completions', 'Team-trained AI models', 'On-premise deployment', '80+ languages', 'IDE-agnostic'],
            useCases: ['Enterprise privacy', 'Custom AI models', 'Compliance requirements', 'Legacy codebase'],
            pricing: '$12/user/tháng (Pro), Enterprise custom',
            website: 'https://www.tabnine.com',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        // ========== K. TRADING TOOLS ==========
        tradingview: {
            id: 'tradingview',
            name: 'TradingView',
            provider: 'TradingView Inc.',
            category: 'trading',
            icon: 'candlestick_chart',
            color: '#2962ff',
            description: 'Advanced charting platform với AI pattern recognition và social trading',
            features: ['100+ technical indicators', 'Pine Script automation', 'AI pattern recognition', 'Social trading', 'Real-time data'],
            useCases: ['Technical analysis', 'Chart patterns', 'Alert automation', 'Strategy backtesting'],
            pricing: 'Free, $14.95/tháng (Pro), $29.95/tháng (Pro+), $59.95/tháng (Premium)',
            website: 'https://www.tradingview.com',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        '3commas': {
            id: '3commas',
            name: '3Commas',
            provider: '3Commas Corp.',
            category: 'trading',
            icon: 'smart_toy',
            color: '#00c853',
            description: 'Automated crypto trading bots với DCA, Grid và smart terminals',
            features: ['DCA bots', 'Grid trading', 'Smart terminal', 'Portfolio tracking', 'Copy trading'],
            useCases: ['Crypto automation', 'DCA strategies', 'Portfolio management', '20+ exchanges'],
            pricing: '$29/tháng (Starter), $59/tháng (Advanced), $99/tháng (Pro)',
            website: 'https://3commas.io',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        tickeron: {
            id: 'tickeron',
            name: 'Tickeron',
            provider: 'Tickeron Inc.',
            category: 'trading',
            icon: 'insights',
            color: '#ff6d00',
            description: 'AI pattern recognition và trend prediction cho stocks, crypto, forex',
            features: ['AI Pattern Recognition', 'Trend Prediction Engine', 'Portfolio optimization', 'Real-time signals', 'Confidence levels'],
            useCases: ['Pattern detection', 'AI signals', 'Multi-asset analysis', 'Risk assessment'],
            pricing: '$29/tháng (Basic), $59/tháng (Premium), $99/tháng (Pro)',
            website: 'https://tickeron.com',
            vietnameseSupport: 'Không',
            apiAvailable: true
        },

        quantconnect: {
            id: 'quantconnect',
            name: 'QuantConnect',
            provider: 'QuantConnect Corporation',
            category: 'trading',
            icon: 'code',
            color: '#f5a623',
            description: 'Open-source algorithmic trading với Python/C# và ML integration',
            features: ['Python/C# algorithms', 'ML integration (TensorFlow)', 'Tick-level backtesting', 'Live trading', 'Cloud execution'],
            useCases: ['Algorithmic trading', 'Quantitative research', 'Strategy development', 'Multi-broker'],
            pricing: 'Free (limited), $8/tháng (Researcher), $20/tháng (Team)',
            website: 'https://www.quantconnect.com',
            vietnameseSupport: 'Không',
            apiAvailable: true
        },

        // ========== L. PRODUCTIVITY TOOLS ==========
        notionai: {
            id: 'notionai',
            name: 'Notion AI',
            provider: 'Notion Labs Inc.',
            category: 'productivity',
            icon: 'edit_note',
            color: '#000000',
            description: 'AI workspace assistant cho writing, editing, summarizing và automation',
            features: ['AI content generation', 'Database autofill', 'Enterprise search', 'Meeting notes', 'Multi-model (GPT-4, Claude)'],
            useCases: ['Document creation', 'Meeting automation', 'Knowledge base', 'Project management'],
            pricing: '$8-10/member/tháng (add-on)',
            website: 'https://www.notion.so/product/ai',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        },

        otterai: {
            id: 'otterai',
            name: 'Otter.ai',
            provider: 'Otter.ai Inc.',
            category: 'productivity',
            icon: 'mic',
            color: '#3b82f6',
            description: 'AI meeting transcription với real-time collaboration và action items',
            features: ['Real-time transcription', 'Speaker identification', 'AI summaries', 'Action items extraction', 'Zoom/Meet/Teams integration'],
            useCases: ['Meeting transcription', 'Interview recording', 'Lecture notes', 'Team collaboration'],
            pricing: 'Free (600 phút/tháng), $16.99/tháng (Pro), $30/user/tháng (Business)',
            website: 'https://otter.ai',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        reclaimai: {
            id: 'reclaimai',
            name: 'Reclaim.ai',
            provider: 'Reclaim.ai Inc.',
            category: 'productivity',
            icon: 'calendar_month',
            color: '#4f46e5',
            description: 'Smart calendar assistant tự động schedule habits và protect focus time',
            features: ['Smart habit scheduling', 'Calendar sync', 'Focus time protection', 'Meeting buffering', 'Task manager integration'],
            useCases: ['Calendar automation', 'Focus management', 'Team scheduling', 'Work-life balance'],
            pricing: 'Free (Lite), $8/user/tháng (Starter), $12/user/tháng (Business)',
            website: 'https://reclaim.ai',
            vietnameseSupport: 'Khá',
            apiAvailable: true
        },

        perplexity: {
            id: 'perplexity',
            name: 'Perplexity AI',
            provider: 'Perplexity AI',
            category: 'productivity',
            icon: 'search',
            color: '#20b2aa',
            description: 'AI research assistant với real-time web search và cited answers',
            features: ['Real-time web search', 'Multi-model (GPT-4, Claude)', 'File upload analysis', 'Unlimited Copilot', 'Citations'],
            useCases: ['Research', 'Fact-checking', 'News analysis', 'Technical documentation'],
            pricing: 'Free (limited), $20/tháng (Pro)',
            website: 'https://www.perplexity.ai',
            vietnameseSupport: 'Tốt',
            apiAvailable: true
        }
    };

    /**
     * TOOL_INDUSTRY_MATRIX - Độ phù hợp tool-ngành (score 1-5)
     * Score: 1=Rất ít phù hợp, 3=Phù hợp, 5=Rất phù hợp
     */
    const TOOL_INDUSTRY_MATRIX = {
        // Foundation Models - Phù hợp mọi ngành
        chatgpt: {
            programming: 5,
            trading: 4,
            'personal-assistant': 5
        },
        claude: {
            programming: 5,
            trading: 5,
            'personal-assistant': 5
        },
        gemini: {
            programming: 4,
            trading: 3,
            'personal-assistant': 5
        },

        // Development Tools
        githubcopilot: {
            programming: 5,
            trading: 2,
            'personal-assistant': 2
        },
        cursor: {
            programming: 5,
            trading: 2,
            'personal-assistant': 2
        },
        codeium: {
            programming: 5,
            trading: 2,
            'personal-assistant': 2
        },
        tabnine: {
            programming: 4,
            trading: 1,
            'personal-assistant': 1
        },

        // Trading Tools
        tradingview: {
            programming: 2,
            trading: 5,
            'personal-assistant': 2
        },
        '3commas': {
            programming: 1,
            trading: 5,
            'personal-assistant': 1
        },
        tickeron: {
            programming: 1,
            trading: 5,
            'personal-assistant': 1
        },
        quantconnect: {
            programming: 3,
            trading: 5,
            'personal-assistant': 1
        },

        // Productivity Tools
        notionai: {
            programming: 4,
            trading: 3,
            'personal-assistant': 5
        },
        otterai: {
            programming: 3,
            trading: 2,
            'personal-assistant': 5
        },
        reclaimai: {
            programming: 3,
            trading: 2,
            'personal-assistant': 5
        },
        perplexity: {
            programming: 4,
            trading: 4,
            'personal-assistant': 5
        },

        // Creative Tools (existing)
        canvaai: {
            programming: 2,
            trading: 2,
            'personal-assistant': 4
        },
        copyai: {
            programming: 2,
            trading: 2,
            'personal-assistant': 4
        },

        // Analytics (existing)
        powerbi: {
            programming: 3,
            trading: 4,
            'personal-assistant': 3
        },

        // Vietnamese Tools (existing)
        vbee: {
            programming: 2,
            trading: 1,
            'personal-assistant': 4
        }
    };

    /**
     * ToolUtils - Utility functions cho tool-industry operations
     */
    const ToolUtils = {
        /**
         * Lấy tools cho một ngành, sắp xếp theo độ phù hợp
         * @param {string} industryId - ID của ngành
         * @param {number} minScore - Score tối thiểu (default: 3)
         * @param {number} limit - Giới hạn số tools (default: 8)
         */
        getToolsForIndustry(industryId, minScore = 3, limit = 8) {
            const tools = Object.entries(TOOL_INDUSTRY_MATRIX)
                .filter(([toolId, scores]) => scores[industryId] >= minScore)
                .map(([toolId, scores]) => ({
                    id: toolId,
                    score: scores[industryId],
                    data: TOOLS_DATA[toolId]
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);

            return tools;
        },

        /**
         * Lấy essential tools cho một ngành
         */
        getEssentialTools(industryId) {
            const industry = INDUSTRIES_DATA[industryId];
            if (!industry) return [];

            return industry.essentialTools.map(id => ({
                id,
                isEssential: true,
                data: TOOLS_DATA[id]
            })).filter(t => t.data);
        },

        /**
         * Lấy tất cả tools cho ngành (essential + recommended từ matrix)
         */
        getAllToolsForIndustry(industryId) {
            const industry = INDUSTRIES_DATA[industryId];
            if (!industry) return { essential: [], recommended: [], optional: [] };

            const essential = this.getEssentialTools(industryId);
            const essentialIds = new Set(essential.map(t => t.id));

            const matrixTools = this.getToolsForIndustry(industryId, 4, 10)
                .filter(t => !essentialIds.has(t.id))
                .map(t => ({ ...t, isEssential: false }));

            return {
                essential,
                recommended: matrixTools,
                optional: industry.optionalTools?.map(id => ({
                    id,
                    isOptional: true,
                    data: TOOLS_DATA[id]
                })).filter(t => t.data) || []
            };
        },

        /**
         * Lấy tools theo category
         */
        getToolsByCategory(category) {
            return Object.entries(TOOLS_DATA)
                .filter(([_, tool]) => tool.category === category)
                .map(([id, data]) => ({ id, data }));
        },

        /**
         * Search tools
         */
        searchTools(query) {
            const q = query.toLowerCase();
            return Object.entries(TOOLS_DATA)
                .filter(([_, tool]) =>
                    tool.name.toLowerCase().includes(q) ||
                    tool.description.toLowerCase().includes(q) ||
                    tool.useCases.some(uc => uc.toLowerCase().includes(q))
                )
                .map(([id, data]) => ({ id, data }));
        },

        /**
         * Lấy category label
         */
        getCategoryLabel(category) {
            const labels = {
                foundation: 'Foundation Models',
                vietnam: 'AI Việt Nam',
                chatbot: 'Chatbot & CSKH',
                vision: 'Computer Vision & OCR',
                crm: 'CRM & Marketing',
                ecommerce: 'E-Commerce',
                agriculture: 'Nông nghiệp',
                logistics: 'Logistics',
                creative: 'Creative AI',
                analytics: 'Data Analytics'
            };
            return labels[category] || category;
        },

        /**
         * Format score thành text
         */
        getScoreLabel(score) {
            if (score >= 5) return { text: 'Rất phù hợp', color: '#22c55e' };
            if (score >= 4) return { text: 'Phù hợp tốt', color: '#84cc16' };
            if (score >= 3) return { text: 'Phù hợp', color: '#eab308' };
            if (score >= 2) return { text: 'Ít phù hợp', color: '#f97316' };
            return { text: 'Không phù hợp', color: '#ef4444' };
        }
    };

    // ============================================
    // CONVERSION FEATURES - Phase 2 Additional
    // ============================================

    /**
     * ROICalculator - Tính toán lợi ích đầu tư AI
     */
    const ROICalculator = {
        // Multipliers theo ngành (từ research thực tế)
        industryMultipliers: {
            programming: {
                hoursPerEmployee: 4.5,
                automationPotential: 0.45,
                productivityBoost: 3.0,
                errorReduction: 0.50,
                description: 'Lập trình viên tiết kiệm 4-6h/ngày với AI coding assistants'
            },
            trading: {
                hoursPerEmployee: 3.0,
                automationPotential: 0.60,
                productivityBoost: 1.65,
                riskReduction: 0.40,
                description: 'Trader cải thiện win rate 15-20% với AI analysis'
            },
            'personal-assistant': {
                hoursPerEmployee: 2.5,
                automationPotential: 0.35,
                productivityBoost: 1.50,
                organizationBoost: 0.80,
                description: 'Tiết kiệm 2-3h/ngày cho planning, meetings, knowledge management'
            }
        },

        // Cost estimates (VND/tháng cho tools)
        toolCosts: {
            small: 500000,      // 1-10 nhân viên
            medium: 2000000,    // 11-50
            large: 5000000,     // 51-200
            enterprise: 15000000 // 200+
        },

        /**
         * Tính toán ROI dựa trên inputs
         */
        calculate(inputs) {
            const { employees, avgSalary, industry } = inputs;
            const multiplier = this.industryMultipliers[industry];

            // Xác định company size
            let companySize = 'small';
            if (employees > 200) companySize = 'enterprise';
            else if (employees > 50) companySize = 'large';
            else if (employees > 10) companySize = 'medium';

            // Calculations
            const hourlyRate = avgSalary / 22 / 8;
            const hoursSavedDaily = employees * multiplier.hoursPerEmployee;
            const hoursSavedMonthly = hoursSavedDaily * 22;
            const moneySavedMonthly = hoursSavedMonthly * hourlyRate;
            const toolCost = this.toolCosts[companySize];
            const netSavings = moneySavedMonthly - toolCost;
            const roi = toolCost > 0 ? ((netSavings / toolCost) * 100).toFixed(0) : 0;
            const paybackMonths = netSavings > 0 ? (toolCost / netSavings).toFixed(1) : 0;

            return {
                hoursSavedMonthly: Math.round(hoursSavedMonthly),
                moneySavedMonthly: Math.round(moneySavedMonthly),
                toolCost,
                netSavings: Math.round(netSavings),
                roi,
                paybackMonths,
                productivityGain: Math.round(multiplier.automationPotential * 100),
                companySize
            };
        },

        /**
         * Format số tiền VND
         */
        formatMoney(amount) {
            if (amount >= 1000000) {
                return (amount / 1000000).toFixed(1) + ' triệu';
            }
            return amount.toLocaleString('vi-VN');
        },

        /**
         * Initialize ROI Calculator UI
         */
        init() {
            const employeesSlider = document.getElementById('roi-employees');
            const salarySlider = document.getElementById('roi-salary');
            const industrySelect = document.getElementById('roi-industry');
            const calculateBtn = document.getElementById('btn-calculate-roi');

            if (!employeesSlider || !calculateBtn) return;

            // Update display values
            const updateDisplays = () => {
                const empValue = document.getElementById('emp-value');
                const salaryValue = document.getElementById('salary-value');
                if (empValue) empValue.textContent = employeesSlider.value;
                if (salaryValue) salaryValue.textContent = salarySlider.value;
            };

            employeesSlider?.addEventListener('input', updateDisplays);
            salarySlider?.addEventListener('input', updateDisplays);

            // Calculate on button click
            calculateBtn.addEventListener('click', () => {
                const inputs = {
                    employees: parseInt(employeesSlider.value),
                    avgSalary: parseInt(salarySlider.value) * 1000000,
                    industry: industrySelect.value
                };

                const results = this.calculate(inputs);
                this.displayResults(results, inputs);

                // Track event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'roi_calculated', {
                        industry: inputs.industry,
                        employees: inputs.employees
                    });
                }
            });

            // Initialize displays
            updateDisplays();
        },

        /**
         * Display results
         */
        displayResults(results, inputs) {
            const resultsContainer = document.getElementById('roi-results');
            if (!resultsContainer) return;

            // Update values
            document.getElementById('result-hours').textContent = results.hoursSavedMonthly.toLocaleString('vi-VN');
            document.getElementById('result-savings').textContent = this.formatMoney(results.moneySavedMonthly);
            document.getElementById('result-roi').textContent = results.roi + '%';

            const paybackSpan = document.querySelector('#result-payback span');
            if (paybackSpan) paybackSpan.textContent = results.paybackMonths;

            // Update detail text
            document.getElementById('detail-employees').textContent = inputs.employees;
            document.getElementById('detail-cost').textContent = this.formatMoney(results.toolCost);
            document.getElementById('detail-savings').textContent = this.formatMoney(results.moneySavedMonthly);

            // Show results with animation
            resultsContainer.classList.remove('hidden');
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Animate numbers
            this.animateNumbers();
        },

        /**
         * Animate numbers
         */
        animateNumbers() {
            document.querySelectorAll('.roi-number').forEach(el => {
                el.classList.add('roi-number--animated');
            });
        }
    };

    /**
     * AIReadinessQuiz - Đánh giá mức độ sẵn sàng AI
     */
    const AIReadinessQuiz = {
        questions: [
            {
                id: 1,
                question: "Dữ liệu của công ty bạn hiện được quản lý như thế nào?",
                options: [
                    { text: "Hoàn toàn thủ công (giấy tờ, Excel rồi rạc)", score: 1 },
                    { text: "Một phần số hóa, chưa có hệ thống thống nhất", score: 2 },
                    { text: "Đã số hóa cơ bản, có phần mềm quản lý", score: 3 },
                    { text: "Dữ liệu được tập trung hóa trên cloud", score: 4 },
                    { text: "Dữ liệu real-time, sẵn sàng cho AI/ML", score: 5 }
                ],
                category: "data"
            },
            {
                id: 2,
                question: "Nhân viên trong công ty có sẵn sàng học công nghệ mới không?",
                options: [
                    { text: "Rất khó khăn, phản đối thay đổi", score: 1 },
                    { text: "Một số người không tiếp thu được", score: 2 },
                    { text: "Trung bình, cần đào tạo nhiều", score: 3 },
                    { text: "Khá tốt, đa số hào hứng", score: 4 },
                    { text: "Rất tốt, tech-savvy và chủ động", score: 5 }
                ],
                category: "people"
            },
            {
                id: 3,
                question: "Ngân sách dự kiến cho AI trong năm tới?",
                options: [
                    { text: "Không có ngân sách riêng", score: 1 },
                    { text: "Dưới 10 triệu VNĐ", score: 2 },
                    { text: "10-50 triệu VNĐ", score: 3 },
                    { text: "50-200 triệu VNĐ", score: 4 },
                    { text: "Trên 200 triệu VNĐ", score: 5 }
                ],
                category: "budget"
            },
            {
                id: 4,
                question: "Hệ thống IT hiện tại của công ty?",
                options: [
                    { text: "Không có IT chuyên trách", score: 1 },
                    { text: "1 người phụ trách đa nhiệm", score: 2 },
                    { text: "Có team IT nhỏ (2-3 người)", score: 3 },
                    { text: "Team IT đầy đủ (5+ người)", score: 4 },
                    { text: "Có IT team + Dev team riêng", score: 5 }
                ],
                category: "infrastructure"
            },
            {
                id: 5,
                question: "Mục tiêu ưu tiên khi triển khai AI?",
                options: [
                    { text: "Chưa rõ muốn làm gì", score: 1 },
                    { text: "Giảm chi phí vận hành", score: 2 },
                    { text: "Tăng hiệu suất nhân viên", score: 3 },
                    { text: "Cải thiện trải nghiệm khách hàng", score: 4 },
                    { text: "Đổi mới sản phẩm/dịch vụ", score: 5 }
                ],
                category: "strategy"
            }
        ],

        levels: {
            1: {
                name: "Level 1: Khởi động",
                description: "Doanh nghiệp cần xây dựng nền tảng số hóa trước khi triển khai AI.",
                recommendation: "Bắt đầu với các công cụ đơn giản như ChatGPT, Canva AI để làm quen."
            },
            2: {
                name: "Level 2: Chuẩn bị",
                description: "Đã có một số cơ sở, nhưng cần đầu tư thêm vào dữ liệu và đào tạo.",
                recommendation: "Tập trung số hóa dữ liệu và chọn 1-2 use case AI đơn giản để pilot."
            },
            3: {
                name: "Level 3: Sẵn sàng",
                description: "Doanh nghiệp đã sẵn sàng triển khai AI với quy mô nhỏ đến trung bình.",
                recommendation: "Triển khai AI cho một số quy trình cụ thể, dùng FPT.AI, BotStar."
            },
            4: {
                name: "Level 4: Nâng cao",
                description: "Cơ sở hạ tầng tốt, có thể triển khai AI ở quy mô lớn.",
                recommendation: "Triển khai tích hợp đa công cụ, tự động hóa workflow hoàn chỉnh."
            },
            5: {
                name: "Level 5: Dẫn đầu",
                description: "Doanh nghiệp tiên phong, sẵn sàng cho AI transformation toàn diện.",
                recommendation: "Xây dựng AI strategy dài hạn, custom AI models cho ngành."
            }
        },

        currentQuestion: 0,
        answers: [],

        calculateLevel() {
            const avgScore = this.answers.reduce((sum, a) => sum + a.score, 0) / this.answers.length;
            return Math.round(avgScore);
        }
    };

    /**
     * CaseStudies - Các case study thực tế
     */
    const CaseStudies = [
        {
            id: "programming-01",
            industry: "programming",
            company: "Startup SaaS VN",
            location: "TP. Hồ Chí Minh",
            size: "20 developers",
            challenge: "Team nhỏ phải ship nhanh, code review mất nhiều thời gian, technical debt cao",
            solution: "GitHub Copilot + Cursor + Codeium cho toàn team",
            implementation: "2 tuần",
            results: {
                codingSpeed: "+5x",
                codeReviewTime: "-60%",
                bugsReduction: "-40%",
                devProductivity: "+300%"
            },
            tools: ["githubcopilot", "cursor", "codeium"],
            testimonial: {
                quote: "Từ khi có AI coding assistant, productivity của team tăng gấp 5. Code chất lượng hơn, ship nhanh hơn.",
                author: "Nguyễn Minh Tuấn",
                role: "CTO"
            },
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
        },
        {
            id: "trading-01",
            industry: "trading",
            company: "Crypto Trader VN",
            location: "Hà Nội",
            size: "Freelancer",
            challenge: "Theo dõi 50+ đồng coin, phân tích kỹ thuật mất nhiều thời gian, miss cơ hội",
            solution: "TradingView Premium + 3Commas cho auto trading",
            implementation: "1 tuần",
            results: {
                tradingAccuracy: "+45%",
                timeSpent: "-80%",
                profitability: "+120%",
                stressLevel: "-70%"
            },
            tools: ["tradingview", "3commas", "tickeron"],
            testimonial: {
                quote: "AI giúp tôi scan thị trường 24/7. Không còn phải thức đêm canh chart, bot làm hết.",
                author: "Trần Đức Anh",
                role: "Full-time Trader"
            },
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"
        },
        {
            id: "personal-assistant-01",
            industry: "personal-assistant",
            company: "Solo Entrepreneur",
            location: "Đà Nẵng",
            size: "1 người",
            challenge: "Quản lý nhiều dự án, meeting nhiều, ghi chú lộn xộn, quên task quan trọng",
            solution: "Notion AI + Otter.ai + Reclaim AI cho productivity",
            implementation: "3 ngày",
            results: {
                taskCompletion: "+80%",
                meetingNotes: "100% auto",
                freeTime: "+3h/ngày",
                stress: "-50%"
            },
            tools: ["notionai", "otterai", "reclaimai"],
            testimonial: {
                quote: "AI như có thêm 1 assistant cá nhân. Ghi chú meeting tự động, schedule được optimize, không bao giờ quên task.",
                author: "Lê Thị Mai",
                role: "Consultant"
            },
            image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
        }
    ];

    /**
     * Testimonials - Đánh giá khách hàng
     */
    const Testimonials = [
        {
            quote: "Aivan.vn giúp chúng tôi chọn đúng công cụ từ đầu, tiết kiệm hàng tháng trial and error.",
            author: "Nguyễn Thị Hương",
            role: "CEO",
            company: "Công ty TNHH ABC",
            avatar: "https://i.pravatar.cc/150?img=1",
            industry: "ecommerce"
        },
        {
            quote: "Chỉ sau 2 tháng triển khai, hiệu suất team tăng 40%. ROI vượt mong đợi.",
            author: "Trần Văn Minh",
            role: "COO",
            company: "TechStart Vietnam",
            avatar: "https://i.pravatar.cc/150?img=3",
            industry: "technology"
        },
        {
            quote: "Đội ngũ tư vấn rất chuyên nghiệp, hiểu rõ ngành và đưa ra giải pháp phù hợp.",
            author: "Lê Thị Lan",
            role: "Giám đốc Marketing",
            company: "Retail Plus",
            avatar: "https://i.pravatar.cc/150?img=5",
            industry: "retail"
        },
        {
            quote: "Từ người nghi ngờ AI, giờ tôi là người ủng hộ nhiệt thành. Cảm ơn aivan.vn!",
            author: "Phạm Hoàng Nam",
            role: "Chủ doanh nghiệp",
            company: "Nam Phát Logistics",
            avatar: "https://i.pravatar.cc/150?img=8",
            industry: "logistics"
        }
    ];

    /**
     * Timeline - Lộ trình triển khai 3 tháng
     */
    const ImplementationTimeline = [
        {
            month: 1,
            title: "Assessment",
            description: "Audit hiện trạng, xác định use case priority",
            tasks: ["Phỏng vấn stakeholders", "Đánh giá dữ liệu hiện có", "Xác định KPIs"],
            deliverables: ["Báo cáo hiện trạng", "Roadmap 3 tháng"]
        },
        {
            month: 2,
            title: "Pilot",
            description: "Triển khai thử nghiệm với 1-2 tools",
            tasks: ["Setup công cụ AI", "Đào tạo nhân viên", "Thu thập feedback"],
            deliverables: ["Báo cáo pilot", "SOPs cho team"]
        },
        {
            month: 3,
            title: "Scale",
            description: "Mở rộng toàn bộ doanh nghiệp, đo lường ROI",
            tasks: ["Rollout toàn bộ", "Tích hợp workflows", "Optimize performance"],
            deliverables: ["Báo cáo ROI", "Kế hoạch mở rộng"]
        }
    ];

    // ============================================
    // END DATA LAYER
    // ============================================

    // Router Module
    const Router = {
        currentPage: CONFIG.DEFAULT_PAGE,

        /**
         * Initialize router
         */
        init() {
            this.bindEvents();
            this.handleInitialRoute();
        },

        /**
         * Bind all event listeners
         */
        bindEvents() {
            // Handle browser back/forward buttons
            window.addEventListener('popstate', (e) => {
                const page = e.state?.page || CONFIG.DEFAULT_PAGE;
                this.showPage(page, false);
            });

            // Handle hash changes for deep linking
            window.addEventListener('hashchange', () => {
                const hash = window.location.hash.replace('#', '');
                if (CONFIG.AVAILABLE_PAGES.includes(hash) && hash !== this.currentPage) {
                    this.showPage(hash, true);
                }
            });
        },

        /**
         * Handle initial route on page load
         */
        handleInitialRoute() {
            const hash = window.location.hash.replace('#', '');
            if (CONFIG.AVAILABLE_PAGES.includes(hash)) {
                this.showPage(hash, false);
            } else {
                this.showPage(CONFIG.DEFAULT_PAGE, false);
            }
        },

        /**
         * Show a specific page
         * @param {string} page - Page identifier
         * @param {boolean} pushState - Whether to update browser history
         */
        showPage(page, pushState = true) {
            // Validate page
            if (!CONFIG.AVAILABLE_PAGES.includes(page)) {
                console.warn(`[Router] Page not found: ${page}`);
                return;
            }

            const targetPage = document.getElementById(`page-${page}`);
            if (!targetPage) {
                console.warn(`[Router] Page element not found: page-${page}`);
                return;
            }

            // Hide all pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.remove('active');
                p.setAttribute('aria-hidden', 'true');
            });

            // Show target page
            targetPage.classList.add('active');
            targetPage.setAttribute('aria-hidden', 'false');
            this.currentPage = page;

            // Update URL
            if (pushState) {
                history.pushState({ page }, '', `#${page}`);
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Update page title based on current page
            this.updatePageTitle(page);

            // Track page view
            this.trackPageView(page);

            // Focus management for accessibility
            this.focusMainContent();
        },

        /**
         * Update document title based on current page
         * @param {string} page
         */
        updatePageTitle(page) {
            const titles = {
                home: 'aivan.vn - Giải pháp AI tối ưu cho doanh nghiệp',
                services: 'Chọn lĩnh vực - aivan.vn',
                results: 'Chiến lược AI - aivan.vn'
            };
            document.title = titles[page] || titles.home;
        },

        /**
         * Focus main content for screen readers
         */
        focusMainContent() {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus({ preventScroll: true });
                mainContent.removeAttribute('tabindex');
            }
        },

        /**
         * Track page view for analytics
         * @param {string} page
         */
        trackPageView(page) {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_view', { page_path: `/${page}` });
            }

            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'PageView');
            }

            // Custom event for other tracking
            window.dispatchEvent(new CustomEvent('pagechange', { detail: { page } }));

            // Render results page if navigating to results
            if (page === 'results') {
                ResultsRenderer.render();
            }
        }
    };

    // Results Renderer Module - Dynamic content based on selected industry
    const ResultsRenderer = {
        /**
         * Render results page content based on selected industry
         */
        render() {
            const industry = Storage.get(CONFIG.STORAGE_KEY);

            if (!industry || !INDUSTRIES_DATA[industry]) {
                console.warn('[ResultsRenderer] No industry selected, using default');
                this.renderDefault();
                return;
            }

            const data = INDUSTRIES_DATA[industry];
            console.log(`[ResultsRenderer] Rendering for industry: ${industry}`);

            this.renderIndustryName(data);
            this.renderWorkflow(data);
            this.renderStats(data);
            this.renderTools(data);
        },

        /**
         * Render industry name in heading
         * @param {Object} data - Industry data
         */
        renderIndustryName(data) {
            const nameEl = document.getElementById('results-industry-name');
            if (nameEl) {
                nameEl.textContent = data.name;
            }
        },

        /**
         * Render workflow section - Improved card-based design
         * @param {Object} data - Industry data
         */
        renderWorkflow(data) {
            const container = document.getElementById('results-workflow-container');
            const subtitle = document.getElementById('results-workflow-subtitle');

            if (!container || !data.workflows) return;

            // Update subtitle
            if (subtitle) {
                subtitle.textContent = `Tự động hóa quy trình ${data.name.toLowerCase()}`;
            }

            // Render workflow steps with improved card design
            const stepsHtml = data.workflows.map((step, index) => {
                const isLast = index === data.workflows.length - 1;
                const colors = ['#ec6d13', '#60a5fa', '#ec4899', '#10b981'];
                const color = colors[index % colors.length];
                const textColors = ['text-primary', 'text-blue-400', 'text-pink-500', 'text-green-400'];
                const textColor = textColors[index % textColors.length];

                return `
                    <div class="workflow-step" data-step="${index + 1}" style="--step-color: ${color};" role="article" aria-label="Bước ${index + 1}: ${step.title}">
                        ${!isLast ? '<div class="workflow-step__connector" aria-hidden="true"></div>' : ''}
                        <div class="workflow-step__icon ${textColor}">
                            <span class="material-symbols-outlined text-2xl" aria-hidden="true">${step.icon}</span>
                        </div>
                        <div class="flex flex-col flex-1">
                            <div>
                                <span class="workflow-step__progress" aria-hidden="true">Bước ${index + 1}/${data.workflows.length}</span>
                                <h4>${step.title}</h4>
                                <p>${step.description}</p>
                            </div>
                            <div class="workflow-step__tools">
                                ${this.getToolName(step.primaryTool) ? `<span class="tag tag--primary">${this.getToolName(step.primaryTool)}</span>` : ''}
                                ${(step.supportingTools || []).map(t => this.getToolName(t) ? `<span class="tag">${this.getToolName(t)}</span>` : '').join('')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = stepsHtml;
        },

        /**
         * Render stats section
         * @param {Object} data - Industry data
         */
        renderStats(data) {
            const efficiencyEl = document.getElementById('results-stat-efficiency');
            const descEl = document.getElementById('results-stat-desc');
            const timeEl = document.getElementById('results-stat-time');

            if (data.stats) {
                if (efficiencyEl) {
                    efficiencyEl.innerHTML = `<span class="text-primary">${data.stats.efficiency.charAt(0)}</span>${data.stats.efficiency.slice(1).replace('%', '')}<span class="text-3xl text-white/40">%</span>`;
                }
                if (descEl) {
                    descEl.textContent = data.stats.description || 'Tăng hiệu quả vận hành';
                }
                if (timeEl) {
                    timeEl.textContent = data.stats.timeSaved || '2.5h';
                }
            }
        },

        /**
         * Render tools section
         * @param {Object} data - Industry data
         */
        renderTools(data) {
            const container = document.getElementById('results-tools-container');
            if (!container) return;

            // Get all recommended tools for this industry
            const toolIds = [
                ...(data.essentialTools || []),
                ...(data.recommendedTools || []),
                ...(data.optionalTools || [])
            ].slice(0, 4); // Limit to 4 tools

            const toolsHtml = toolIds.map(toolId => {
                const tool = TOOLS_DATA[toolId];
                if (!tool) return '';

                return `
                    <article class="tool-card">
                        <div class="flex items-start justify-between mb-4">
                            <div class="w-12 h-12 rounded-xl flex items-center justify-center p-1 shadow-lg" style="background-color: ${tool.color || '#ffffff'};">
                                <span class="material-symbols-outlined text-2xl ${tool.color ? 'text-white' : 'text-black'}" aria-hidden="true">${tool.icon}</span>
                            </div>
                            <span class="tag">${this.getCategoryName(tool.category)}</span>
                        </div>
                        <h4 class="text-white font-bold text-lg mb-2">${tool.name}</h4>
                        <p class="text-white/40 text-sm leading-relaxed line-clamp-3">${tool.description}</p>
                    </article>
                `;
            }).join('');

            container.innerHTML = toolsHtml || '<p class="text-white/50 col-span-4 text-center">Chưa có dữ liệu công cụ cho ngành này</p>';
        },

        /**
         * Get tool display name
         * @param {string} toolId
         * @returns {string|null}
         */
        getToolName(toolId) {
            const tool = TOOLS_DATA[toolId];
            return tool ? tool.name : null;
        },

        /**
         * Get category display name in Vietnamese
         * @param {string} category
         * @returns {string}
         */
        getCategoryName(category) {
            const map = {
                foundation: 'AI Nền tảng',
                vietnam: 'AI Việt Nam',
                image: 'Thiết kế',
                video: 'Video',
                productivity: 'Năng suất',
                voice: 'Giọng nói',
                code: 'Lập trình',
                crm: 'CRM',
                social: 'Mạng xã hội',
                marketing: 'Marketing',
                automation: 'Tự động hóa',
                finance: 'Tài chính'
            };
            return map[category] || category;
        },

        /**
         * Render default content when no industry selected
         */
        renderDefault() {
            // Render empty state for workflow container
            const workflowContainer = document.getElementById('results-workflow-container');
            if (workflowContainer) {
                workflowContainer.innerHTML = `
                    <div class="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-3xl text-primary">category</span>
                        </div>
                        <h4 class="text-xl font-bold text-white mb-2">Chưa chọn ngành nghề</h4>
                        <p class="text-white/50 max-w-md mb-6">Vui lòng quay lại và chọn ngành nghề của bạn để xem chiến lược AI được đề xuất.</p>
                        <button onclick="navigateTo('services')" class="px-6 py-3 rounded-xl bg-primary hover:bg-orange-600 text-white font-bold transition-all flex items-center gap-2">
                            <span class="material-symbols-outlined">arrow_back</span>
                            Chọn ngành nghề
                        </button>
                    </div>
                `;
            }

            // Render empty state for tools container
            const toolsContainer = document.getElementById('results-tools-container');
            if (toolsContainer) {
                toolsContainer.innerHTML = `
                    <div class="col-span-4 text-center py-8">
                        <p class="text-white/40">Công cụ sẽ được hiển thị sau khi chọn ngành nghề</p>
                    </div>
                `;
            }
        }
    };

    // Industry Selection Module
    const IndustrySelector = {
        selectedIndustry: null,

        /**
         * Initialize industry selector
         */
        init() {
            this.restoreSelection();
            this.bindEvents();
        },

        /**
         * Bind event listeners
         */
        bindEvents() {
            // Listen for industry selection changes
            document.querySelectorAll('input[name="industry"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.selectIndustry(e.target.value);
                });
            });
        },

        /**
         * Select an industry
         * @param {string} industry
         */
        selectIndustry(industry) {
            if (!CONFIG.AVAILABLE_INDUSTRIES.includes(industry)) {
                console.warn(`[IndustrySelector] Invalid industry: ${industry}`);
                return;
            }

            this.selectedIndustry = industry;

            // Save to storage
            Storage.set(CONFIG.STORAGE_KEY, industry);

            // Update UI
            this.updateBreadcrumb(industry);

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'select_industry', { industry });
            }

            console.log(`[IndustrySelector] Selected: ${industry}`);
        },

        /**
         * Restore selection from storage
         */
        restoreSelection() {
            const stored = Storage.get(CONFIG.STORAGE_KEY);
            if (stored && CONFIG.AVAILABLE_INDUSTRIES.includes(stored)) {
                const radio = document.querySelector(`input[name="industry"][value="${stored}"]`);
                if (radio) {
                    radio.checked = true;
                    this.selectedIndustry = stored;
                    this.updateBreadcrumb(stored);
                }
            }
        },

        /**
         * Update breadcrumb based on selected industry
         * @param {string} industry
         */
        updateBreadcrumb(industry) {
            const names = {
                programming: 'Lập trình',
                trading: 'Trading',
                'personal-assistant': 'Trợ lý cá nhân'
            };

            const breadcrumbLink = document.querySelector('[data-breadcrumb="industry"]');
            if (breadcrumbLink) {
                breadcrumbLink.textContent = names[industry] || 'Lĩnh vực';
            }
        },

        /**
         * Get current selection
         * @returns {string|null}
         */
        getSelection() {
            return this.selectedIndustry;
        }
    };

    // Storage Module (safe wrapper)
    const Storage = {
        /**
         * Check if localStorage is available
         * @returns {boolean}
         */
        isAvailable() {
            try {
                const test = '__storage_test__';
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        },

        /**
         * Get item from storage
         * @param {string} key
         * @returns {string|null}
         */
        get(key) {
            if (!this.isAvailable()) return null;
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('[Storage] Get error:', e);
                return null;
            }
        },

        /**
         * Set item in storage
         * @param {string} key
         * @param {string} value
         */
        set(key, value) {
            if (!this.isAvailable()) return;
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('[Storage] Set error:', e);
            }
        },

        /**
         * Remove item from storage
         * @param {string} key
         */
        remove(key) {
            if (!this.isAvailable()) return;
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('[Storage] Remove error:', e);
            }
        }
    };

    // Image Handler Module
    const ImageHandler = {
        /**
         * Initialize image error handling
         */
        init() {
            document.querySelectorAll('img[data-fallback]').forEach(img => {
                img.addEventListener('error', this.handleError);
            });
        },

        /**
         * Handle image load error
         * @param {Event} event
         */
        handleError(event) {
            const img = event.target;
            const fallback = img.dataset.fallback;

            if (fallback && img.src !== fallback) {
                console.warn(`[ImageHandler] Failed to load: ${img.src}, using fallback`);
                img.src = fallback;
            }

            // Remove event listener to prevent infinite loop
            img.removeEventListener('error', ImageHandler.handleError);
        }
    };

    // Accessibility Module
    const Accessibility = {
        STORAGE_KEY: 'aivan_accessibility_prefs',
        userPrefs: null,

        /**
         * Initialize accessibility features
         */
        init() {
            this.loadUserPreferences();
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
        },

        /**
         * Load user preferences from localStorage
         */
        loadUserPreferences() {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                this.userPrefs = stored ? JSON.parse(stored) : {};
            } catch (e) {
                this.userPrefs = {};
            }
        },

        /**
         * Save user preferences to localStorage
         */
        saveUserPreferences() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.userPrefs));
            } catch (e) {
                console.warn('[Accessibility] Could not save preferences:', e);
            }
        },

        /**
         * Announce message to screen readers
         */
        announceToScreenReader(message) {
            let announcer = document.getElementById('sr-announcer');
            if (!announcer) {
                announcer = document.createElement('div');
                announcer.id = 'sr-announcer';
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                announcer.className = 'sr-only';
                announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
                document.body.appendChild(announcer);
            }
            announcer.textContent = message;
            setTimeout(() => announcer.textContent = '', 1000);
        },

        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            // ESC to close modals or go back
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Could add modal close logic here
                }
            });
        },

        /**
         * Setup focus management
         */
        setupFocusManagement() {
            // Ensure focusable elements have visible focus
            document.querySelectorAll('a, button, [onclick]').forEach(el => {
                if (!el.hasAttribute('tabindex') && !el.matches('a[href], button, input, textarea, select')) {
                    el.setAttribute('tabindex', '0');
                    el.setAttribute('role', 'button');
                }
            });
        }
    };

    // Coming Soon Handler
    const ComingSoon = {
        /**
         * Show coming soon notice
         * @param {string} feature
         */
        show(feature = 'Tính năng') {
            // Use a non-blocking notification instead of alert
            const notification = document.createElement('div');
            notification.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-surface-dark border border-white/10 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-up';
            notification.setAttribute('role', 'status');
            notification.setAttribute('aria-live', 'polite');
            notification.innerHTML = `
                <span class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">info</span>
                    ${feature} đang được phát triển
                </span>
            `;

            document.body.appendChild(notification);

            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    };

    // Form Handler Module
    const FormHandler = {
        // Formspree endpoints - Thay bằng endpoint thực tế của bạn
        FORMSPREE_ENDPOINTS: {
            consultation: 'https://formspree.io/f/YOUR_CONSULTATION_FORM_ID',
            newsletter: 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID',
            quick: 'https://formspree.io/f/YOUR_QUICK_FORM_ID'
        },

        // Google Sheets Web App URL - Thay bằng URL thực tế
        GOOGLE_SHEETS_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',

        init() {
            // Bind consultation form
            const consultForm = document.getElementById('consultation-form');
            if (consultForm) {
                consultForm.addEventListener('submit', (e) => this.handleSubmit(e, 'consultation'));
            }

            // Bind newsletter form
            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => this.handleSubmit(e, 'newsletter'));
            }

            // Close modal on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.modal--active').forEach(modal => {
                        this.closeModal(modal.id);
                    });
                }
            });

            // Setup real-time validation
            this.setupRealtimeValidation();
        },

        /**
         * Handle form submission
         */
        async handleSubmit(event, formType) {
            event.preventDefault();
            const form = event.target;
            const submitBtn = form.querySelector('button[type="submit"]');

            // Validate form
            if (!this.validateForm(form)) {
                return;
            }

            // Show loading state
            this.setLoadingState(submitBtn, true, form);

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Add metadata
            data.timestamp = new Date().toISOString();
            data.userAgent = navigator.userAgent;
            data.pageUrl = window.location.href;

            try {
                // Submit to Formspree
                const formspreeResult = await this.submitToFormspree(data, formType);

                // Submit to Google Sheets (backup)
                this.submitToGoogleSheets(data, formType).catch(err => {
                    console.warn('[FormHandler] Google Sheets backup failed:', err);
                });

                // Track conversion
                this.trackConversion(formType, data);

                // Show success animation
                const formContainer = form.closest('.modal__content') || form.parentElement;
                if (formContainer) {
                    SuccessAnimation.render(formContainer, {
                        title: 'Gửi thành công!',
                        message: 'Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.'
                    });

                    // Auto close modal after 3 seconds
                    const modal = form.closest('.modal');
                    if (modal) {
                        setTimeout(() => {
                            this.closeModal(modal.id);
                            // Reset form after modal closes
                            setTimeout(() => form.reset(), 300);
                        }, 3000);
                    }
                } else {
                    this.showToast('Gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm.', 'success');
                    form.reset();
                }

                ARIAAnnouncer.announceFormSuccess(formType);

                // Close modal if in modal
                if (form.closest('.modal')) {
                    this.closeModal(form.closest('.modal').id);
                }

            } catch (error) {
                console.error('[FormHandler] Submit error:', error);
                this.showToast('Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email.', 'error');
                ARIAAnnouncer.announceFormError('Có lỗi xảy ra khi gửi form. Vui lòng thử lại.');
            } finally {
                this.setLoadingState(submitBtn, false, form);
            }
        },

        /**
         * Submit to Formspree
         */
        async submitToFormspree(data, formType) {
            const endpoint = this.FORMSPREE_ENDPOINTS[formType];

            // Nếu chưa có endpoint thực tế, log và giả lập thành công
            if (endpoint.includes('YOUR_')) {
                console.log(`[FormHandler] Formspree not configured yet. Data for ${formType}:`, data);
                await this.simulateDelay(1500);
                return { success: true };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Formspree error: ${response.status}`);
            }

            return await response.json();
        },

        /**
         * Submit to Google Sheets
         */
        async submitToGoogleSheets(data, formType) {
            const url = this.GOOGLE_SHEETS_URL;

            // Nếu chưa có URL thực tế, bỏ qua
            if (url.includes('YOUR_')) {
                return { success: true };
            }

            const response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    formType
                })
            });

            return { success: true };
        },

        /**
         * Track conversion with Google Analytics
         */
        trackConversion(formType, data) {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: formType,
                    form_type: formType,
                    industry: data.industry || 'N/A',
                    company_size: data.size || 'N/A',
                    value: 1
                });

                // Conversion tracking
                if (formType === 'consultation') {
                    gtag('event', 'consultation_request', {
                        event_category: 'conversion',
                        event_label: data.industry || 'unknown'
                    });
                }

                if (formType === 'newsletter') {
                    gtag('event', 'newsletter_signup', {
                        event_category: 'conversion'
                    });
                }
            }

            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: formType,
                    content_category: data.industry || 'unknown'
                });
            }
        },

        /**
         * Track custom events
         */
        trackEvent(eventName, params = {}) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, params);
            }
            console.log(`[Analytics] ${eventName}:`, params);
        },

        /**
         * Set loading state for button and form
         */
        setLoadingState(button, isLoading, form = null) {
            if (!button) return;

            button.disabled = isLoading;
            button.setAttribute('aria-busy', isLoading ? 'true' : 'false');

            const spinner = button.querySelector('.form__submit-spinner');
            const text = button.querySelector('.form__submit-text');

            if (spinner) spinner.hidden = !isLoading;
            if (text) text.hidden = isLoading;

            // Add aria-busy to form for accessibility
            const targetForm = form || button.closest('form');
            if (targetForm) {
                targetForm.setAttribute('aria-busy', isLoading ? 'true' : 'false');
                if (isLoading) {
                    targetForm.classList.add('form--loading');
                } else {
                    targetForm.classList.remove('form--loading');
                }
            }
        },

        /**
         * Simulate delay for demo
         */
        simulateDelay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Validate form
         */
        validateForm(form) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');

            requiredFields.forEach(field => {
                const fieldValid = this.validateField(field, form);
                if (!fieldValid) isValid = false;
            });

            return isValid;
        },

        /**
         * Validate individual field
         */
        validateField(field, form) {
            const formEl = form || field.closest('form');
            const errorEl = formEl?.querySelector(`[data-error-for="${field.name}"]`);
            let isValid = true;
            let message = '';

            if (field.required && !field.value.trim()) {
                isValid = false;
                message = 'Vui lòng điền thông tin này';
            } else if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    isValid = false;
                    message = 'Email không hợp lệ';
                }
            } else if (field.type === 'tel' && field.value) {
                const phoneRegex = /^[0-9]{10,11}$/;
                if (!phoneRegex.test(field.value.replace(/\s/g, ''))) {
                    isValid = false;
                    message = 'Số điện thoại không hợp lệ';
                }
            }

            this.updateFieldVisualState(field, isValid, message, errorEl);
            return isValid;
        },

        /**
         * Update field visual state
         */
        updateFieldVisualState(field, isValid, message, errorEl) {
            if (isValid) {
                field.classList.remove('form__input--error');
                if (field.value.trim()) {
                    field.classList.add('form__input--success');
                }
                field.setAttribute('aria-invalid', 'false');
            } else {
                field.classList.add('form__input--error');
                field.classList.remove('form__input--success');
                field.setAttribute('aria-invalid', 'true');
            }

            if (errorEl) {
                errorEl.textContent = message;
                if (message) {
                    errorEl.setAttribute('role', 'alert');
                } else {
                    errorEl.removeAttribute('role');
                }
            }
        },

        /**
         * Clear field error state
         */
        clearFieldError(field) {
            field.classList.remove('form__input--error');
            field.setAttribute('aria-invalid', 'false');
            const form = field.closest('form');
            const errorEl = form?.querySelector(`[data-error-for="${field.name}"]`);
            if (errorEl) {
                errorEl.textContent = '';
                errorEl.removeAttribute('role');
            }
        },

        /**
         * Setup real-time validation
         */
        setupRealtimeValidation() {
            document.querySelectorAll('form input, form textarea, form select').forEach(field => {
                // Validate on blur
                field.addEventListener('blur', () => {
                    if (field.value.trim()) {
                        this.validateField(field);
                    }
                });

                // Clear error on input
                field.addEventListener('input', () => {
                    this.clearFieldError(field);
                });
            });
        },

        isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        isValidPhone(phone) {
            return /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''));
        },

        /**
         * Open modal with focus trap
         */
        openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return;

            // Store previously focused element
            this._previouslyFocused = document.activeElement;

            modal.hidden = false;
            modal.offsetHeight; // Force reflow
            modal.classList.add('modal--active');
            document.body.style.overflow = 'hidden';

            // Setup focus trap
            this._setupFocusTrap(modal);

            // Focus first focusable element OR modal itself
            const focusable = modal.querySelectorAll(
                'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );

            if (focusable.length > 0) {
                // Focus first input if exists, otherwise first button
                const firstInput = modal.querySelector('input, textarea, select');
                (firstInput || focusable[0]).focus();
            } else {
                // Fallback: focus modal itself
                modal.setAttribute('tabindex', '-1');
                modal.focus();
            }

            // Handle escape key
            this._handleModalKeydown = (e) => this._handleModalEscape(e, modalId);
            document.addEventListener('keydown', this._handleModalKeydown);

            // Announce to screen reader
            const title = modal.querySelector('.modal__title');
            if (title) {
                ARIAAnnouncer.announce(`Đã mở ${title.textContent}`);
            }

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_open', { form_type: modalId });
            }
        },

        /**
         * Close modal and restore focus
         */
        closeModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('modal--active');

                // Remove keydown handler
                if (this._handleModalKeydown) {
                    document.removeEventListener('keydown', this._handleModalKeydown);
                    this._handleModalKeydown = null;
                }

                setTimeout(() => {
                    modal.hidden = true;
                    document.body.style.overflow = '';

                    // Restore previously focused element
                    if (this._previouslyFocused && this._previouslyFocused.focus) {
                        this._previouslyFocused.focus();
                    }
                }, 300);
            }
        },

        /**
         * Handle escape key for modal
         */
        _handleModalEscape(e, modalId) {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
            }
        },

        /**
         * Setup focus trap within modal
         */
        _setupFocusTrap(modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            modal._focusTrapHandler = (e) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            };

            modal.addEventListener('keydown', modal._focusTrapHandler);

            // Setup swipe to dismiss on mobile
            this._setupSwipeToDismiss(modal);
        },

        /**
         * Setup swipe to dismiss for modal on mobile
         */
        _setupSwipeToDismiss(modal) {
            if (!('ontouchstart' in window)) return;

            const content = modal.querySelector('.modal__content');
            if (!content) return;

            let startY = 0;
            let currentY = 0;
            let isDragging = false;

            content.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
                isDragging = true;
                content.style.transition = 'none';
            }, { passive: true });

            content.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                currentY = e.touches[0].clientY;
                const diff = currentY - startY;

                // Only allow dragging down
                if (diff > 0) {
                    content.style.transform = `translateY(${diff}px)`;
                }
            }, { passive: true });

            content.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;

                const diff = currentY - startY;
                content.style.transition = '';

                if (diff > 100) {
                    // Swiped far enough -> dismiss
                    this.closeModal(modal.id);
                } else {
                    // Reset position
                    content.style.transform = '';
                }
            });
        },

        /**
         * Toggle FAB menu
         */
        toggleFab() {
            const fab = document.getElementById('quick-contact-fab');
            if (fab) {
                fab.classList.toggle('fab-container--active');
            }
        },

        /**
         * Open quick form
         */
        openQuickForm() {
            const quickForm = document.getElementById('quick-form');
            if (quickForm) {
                quickForm.hidden = false;
            }
        },

        /**
         * Close quick form
         */
        closeQuickForm() {
            const quickForm = document.getElementById('quick-form');
            if (quickForm) {
                quickForm.hidden = true;
            }
        },

        /**
         * Show toast notification
         */
        showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;
            toast.innerHTML = `
                <span class="material-symbols-outlined toast__icon">${type === 'success' ? 'check_circle' : 'error'}</span>
                <span>${message}</span>
            `;

            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('toast--out');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }
    };

    // Quiz Handler Module
    const QuizHandler = {
        currentQuestion: 0,
        answers: [],

        questions: [
            {
                id: 1,
                question: "Dữ liệu của công ty bạn hiện được quản lý như thế nào?",
                options: [
                    { text: "Hoàn toàn thủ công (giấy tờ, Excel rồi rạc)", score: 1 },
                    { text: "Một phần số hóa, chưa có hệ thống thống nhất", score: 2 },
                    { text: "Đã số hóa cơ bản, có phần mềm quản lý", score: 3 },
                    { text: "Dữ liệu được tập trung hóa trên cloud", score: 4 },
                    { text: "Dữ liệu real-time, sẵn sàng cho AI/ML", score: 5 }
                ]
            },
            {
                id: 2,
                question: "Nhân viên trong công ty có sẵn sàng học công nghệ mới không?",
                options: [
                    { text: "Rất khó khăn, phản đối thay đổi", score: 1 },
                    { text: "Một số ngườ i không tiếp thu được", score: 2 },
                    { text: "Trung bình, cần đào tạo nhiều", score: 3 },
                    { text: "Khá tốt, đa số hào hứng", score: 4 },
                    { text: "Rất tốt, tech-savvy và chủ động", score: 5 }
                ]
            },
            {
                id: 3,
                question: "Ngân sách dự kiến cho AI trong năm tới?",
                options: [
                    { text: "Không có ngân sách riêng", score: 1 },
                    { text: "Dưới 10 triệu VNĐ", score: 2 },
                    { text: "10-50 triệu VNĐ", score: 3 },
                    { text: "50-200 triệu VNĐ", score: 4 },
                    { text: "Trên 200 triệu VNĐ", score: 5 }
                ]
            },
            {
                id: 4,
                question: "Hệ thống IT hiện tại của công ty?",
                options: [
                    { text: "Không có IT chuyên trách", score: 1 },
                    { text: "1 ngườ i phụ trách đa nhiệm", score: 2 },
                    { text: "Có team IT nhỏ (2-3 ngườ i)", score: 3 },
                    { text: "Team IT đầy đủ (5+ ngườ i)", score: 4 },
                    { text: "Có IT team + Dev team riêng", score: 5 }
                ]
            },
            {
                id: 5,
                question: "Mục tiêu ưu tiên khi triển khai AI?",
                options: [
                    { text: "Chưa rõ muốn làm gì", score: 1 },
                    { text: "Giảm chi phí vận hành", score: 2 },
                    { text: "Tăng hiệu suất nhân viên", score: 3 },
                    { text: "Cải thiện trải nghiệm khách hàng", score: 4 },
                    { text: "Đổi mới sản phẩm/dịch vụ", score: 5 }
                ]
            }
        ],

        levels: {
            1: {
                name: "Level 1: Khởi động",
                description: "Doanh nghiệp cần xây dựng nền tảng số hóa trước khi triển khai AI.",
                recommendation: "Bắt đầu với các công cụ đơn giản như ChatGPT, Canva AI để làm quen."
            },
            2: {
                name: "Level 2: Chuẩn bị",
                description: "Đã có một số cơ sở, nhưng cần đầu tư thêm vào dữ liệu và đào tạo.",
                recommendation: "Tập trung số hóa dữ liệu và chọn 1-2 use case AI đơn giản để pilot."
            },
            3: {
                name: "Level 3: Sẵn sàng",
                description: "Doanh nghiệp đã sẵn sàng triển khai AI với quy mô nhỏ đến trung bình.",
                recommendation: "Triển khai AI cho một số quy trình cụ thể, dùng FPT.AI, BotStar."
            },
            4: {
                name: "Level 4: Nâng cao",
                description: "Cơ sở hạ tầng tốt, có thể triển khai AI ở quy mô lớn.",
                recommendation: "Triển khai tích hợp đa công cụ, tự động hóa workflow hoàn chỉnh."
            },
            5: {
                name: "Level 5: Dẫn đầu",
                description: "Doanh nghiệp tiên phong, sẵn sàng cho AI transformation toàn diện.",
                recommendation: "Xây dựng AI strategy dài hạn, custom AI models cho ngành."
            }
        },

        startQuiz() {
            this.currentQuestion = 0;
            this.answers = [];
            this.showScreen('quiz-question');
            this.renderQuestion();

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quiz_started');
            }
        },

        renderQuestion() {
            const question = this.questions[this.currentQuestion];
            const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;

            // Update progress
            document.getElementById('quiz-current').textContent = this.currentQuestion + 1;
            document.getElementById('quiz-progress-text').textContent = `${Math.round(progress)}%`;
            document.getElementById('quiz-progress-bar').style.width = `${progress}%`;

            // Update question text
            document.getElementById('quiz-question-text').textContent = question.question;

            // Announce progress to screen readers
            this.announceProgress(`Câu hỏi ${this.currentQuestion + 1} trên ${this.questions.length}: ${question.question}`);

            // Render options
            const optionsContainer = document.getElementById('quiz-options');
            optionsContainer.innerHTML = question.options.map((option, index) => `
                <button onclick="QuizHandler.selectAnswer(${option.score})" class="w-full text-left p-4 rounded-xl bg-background-dark border border-white/10 hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center gap-3 group" aria-label="${option.text}">
                    <span class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm text-text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">${String.fromCharCode(65 + index)}</span>
                    <span class="text-white/90 group-hover:text-white">${option.text}</span>
                </button>
            `).join('');

            // Show/hide previous button
            const prevBtn = document.getElementById('quiz-prev-btn');
            if (prevBtn) {
                prevBtn.style.visibility = this.currentQuestion > 0 ? 'visible' : 'hidden';
            }
        },

        /**
         * Announce progress to screen readers
         */
        announceProgress(message) {
            let announcer = document.getElementById('quiz-announcer');
            if (!announcer) {
                announcer = document.createElement('div');
                announcer.id = 'quiz-announcer';
                announcer.setAttribute('aria-live', 'polite');
                announcer.setAttribute('aria-atomic', 'true');
                announcer.className = 'sr-only';
                announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
                document.body.appendChild(announcer);
            }
            announcer.textContent = message;
        },

        selectAnswer(score) {
            this.answers[this.currentQuestion] = score;

            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.renderQuestion();
            } else {
                this.showEmailCapture();
            }
        },

        previousQuestion() {
            if (this.currentQuestion > 0) {
                this.currentQuestion--;
                this.renderQuestion();
            }
        },

        showEmailCapture() {
            this.showScreen('quiz-email');
        },

        skipEmail() {
            this.showResults();
        },

        submitEmail(event) {
            event.preventDefault();
            const email = document.getElementById('quiz-email-input').value;

            // Track email capture
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quiz_email_captured', { email });
            }

            this.showResults();
        },

        showResults() {
            const avgScore = this.answers.reduce((sum, a) => sum + a, 0) / this.answers.length;
            const level = Math.round(avgScore);
            const levelData = this.levels[level];

            document.getElementById('quiz-level-name').textContent = levelData.name;
            document.getElementById('quiz-level-description').textContent = levelData.description;
            document.getElementById('quiz-recommendation').textContent = levelData.recommendation;

            this.showScreen('quiz-results');

            // Track completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'quiz_completed', { level });
            }
        },

        restartQuiz() {
            this.startQuiz();
        },

        showScreen(screenId) {
            ['quiz-start', 'quiz-question', 'quiz-email', 'quiz-results'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.classList.add('hidden');
            });

            const target = document.getElementById(screenId);
            if (target) {
                target.classList.remove('hidden');
            }
        }
    };

    // Case Studies Handler
    const CaseStudiesHandler = {
        init() {
            const filters = document.querySelectorAll('.case-filter');
            const cards = document.querySelectorAll('.case-card');

            filters.forEach(filter => {
                filter.addEventListener('click', () => {
                    // Update active state
                    filters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');

                    const industry = filter.dataset.filter;

                    // Filter cards
                    cards.forEach(card => {
                        if (industry === 'all' || card.dataset.industry === industry) {
                            card.classList.remove('hidden');
                            card.style.animation = 'none';
                            card.offsetHeight; // Trigger reflow
                            card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                        } else {
                            card.classList.add('hidden');
                        }
                    });

                    // Track event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'case_study_filter', { industry });
                    }
                });
            });
        }
    };

    // Tool Comparison Handler
    const ToolComparisonHandler = {
        init() {
            const select1 = document.getElementById('compare-tool-1');
            const select2 = document.getElementById('compare-tool-2');

            if (select1 && select2) {
                select1.addEventListener('change', () => this.updateComparison());
                select2.addEventListener('change', () => this.updateComparison());
                this.updateComparison();
            }
        },

        updateComparison() {
            const tool1Id = document.getElementById('compare-tool-1')?.value;
            const tool2Id = document.getElementById('compare-tool-2')?.value;

            if (!tool1Id || !tool2Id) return;

            const tool1 = TOOLS_DATA[tool1Id];
            const tool2 = TOOLS_DATA[tool2Id];

            if (!tool1 || !tool2) return;

            // Update headers
            const header1 = document.getElementById('header-tool-1');
            const header2 = document.getElementById('header-tool-2');
            if (header1) header1.textContent = tool1.name;
            if (header2) header2.textContent = tool2.name;

            // Update provider
            const provider1 = document.getElementById('provider-1');
            const provider2 = document.getElementById('provider-2');
            if (provider1) provider1.textContent = tool1.provider;
            if (provider2) provider2.textContent = tool2.provider;

            // Update price
            const price1 = document.getElementById('price-1');
            const price2 = document.getElementById('price-2');
            if (price1) price1.textContent = tool1.pricing;
            if (price2) price2.textContent = tool2.pricing;

            // Update Vietnamese support
            const vietStars = { 'Xuất sắc': '⭐⭐⭐⭐⭐', 'Tốt': '⭐⭐⭐⭐', 'Khá': '⭐⭐⭐', 'Không': '❌' };
            const viet1 = document.getElementById('viet-1');
            const viet2 = document.getElementById('viet-2');
            if (viet1) viet1.textContent = vietStars[tool1.vietnameseSupport] || '⭐⭐⭐';
            if (viet2) viet2.textContent = vietStars[tool2.vietnameseSupport] || '⭐⭐⭐';

            // Update API availability
            const api1 = document.getElementById('api-1');
            const api2 = document.getElementById('api-2');
            if (api1) api1.textContent = tool1.apiAvailable ? '✓ Có' : '✗ Không';
            if (api2) api2.textContent = tool2.apiAvailable ? '✓ Có' : '✗ Không';
            if (api1) api1.className = `text-center py-4 px-4 ${tool1.apiAvailable ? 'text-green-400' : 'text-red-400'}`;
            if (api2) api2.className = `text-center py-4 px-4 ${tool2.apiAvailable ? 'text-green-400' : 'text-red-400'}`;

            // Update category
            const category1 = document.getElementById('category-1');
            const category2 = document.getElementById('category-2');
            if (category1) category1.textContent = ToolUtils.getCategoryLabel(tool1.category);
            if (category2) category2.textContent = ToolUtils.getCategoryLabel(tool2.category);

            // Determine winner and update badge
            this.updateWinner(tool1, tool2, tool1Id, tool2Id);

            // Track event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'tool_comparison', { tool1: tool1Id, tool2: tool2Id });
            }
        },

        updateWinner(tool1, tool2, tool1Id, tool2Id) {
            const winnerBadge = document.getElementById('comparison-winner');
            if (!winnerBadge) return;

            let winnerText = '';

            // Logic để xác định công cụ phù hợp hơn
            if (tool1Id === 'claude' && tool2Id === 'chatgpt') {
                winnerText = 'Claude phù hợp hơn cho tài liệu dài và phân tích chuyên sâu nhờ 200K context window';
            } else if (tool1Id === 'chatgpt' && tool2Id === 'claude') {
                winnerText = 'ChatGPT phù hợp hơn cho đa dạng tác vụ và có ecosystem rộng hơn';
            } else if (tool1.category === 'vietnam' && tool2.category !== 'vietnam') {
                winnerText = `${tool1.name} phù hợp hơn cho doanh nghiệp Việt Nam nhờ hỗ trợ tiếng Việt xuất sắc`;
            } else if (tool2.category === 'vietnam' && tool1.category !== 'vietnam') {
                winnerText = `${tool2.name} phù hợp hơn cho doanh nghiệp Việt Nam nhờ hỗ trợ tiếng Việt xuất sắc`;
            } else {
                winnerText = `Cả hai công cụ đều mạnh. Chọn ${tool1.name} nếu cần ${tool1.features[0]}, hoặc ${tool2.name} nếu cần ${tool2.features[0]}`;
            }

            winnerBadge.innerHTML = `
                <span class="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium">
                    <span class="material-symbols-outlined">emoji_events</span>
                    ${winnerText}
                </span>
            `;
        }
    };

    // Scroll Animation Module - Intersection Observer for scroll-triggered animations
    const ScrollAnimation = {
        observer: null,
        animatedElements: new Set(),

        init() {
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            if (prefersReducedMotion) {
                // Make all elements visible immediately
                document.querySelectorAll('[data-animate]').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
                return;
            }

            // Create Intersection Observer
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                        this.animatedElements.add(entry.target);

                        // Add animation with stagger delay if specified
                        const delay = entry.target.dataset.stagger || 0;
                        setTimeout(() => {
                            entry.target.classList.add('animate-fade-in-up');
                            entry.target.style.opacity = '1';
                        }, delay * 100);

                        // Unobserve after animation
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements with data-animate attribute
            document.querySelectorAll('[data-animate]').forEach(el => {
                el.style.opacity = '0';
                this.observer.observe(el);
            });

            // Observe service cards with stagger
            document.querySelectorAll('.service-card').forEach((el, index) => {
                el.dataset.stagger = index % 3; // Stagger in groups of 3
                el.style.opacity = '0';
                this.observer.observe(el);
            });

            // Observe tool cards with stagger
            document.querySelectorAll('.tool-card').forEach((el, index) => {
                el.dataset.stagger = index % 4; // Stagger in groups of 4
                el.style.opacity = '0';
                this.observer.observe(el);
            });
        }
    };

    // Timeline Animation Module - Scroll-linked animations
    const TimelineAnimation = {
        observer: null,

        init() {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) return;

            const timeline = document.getElementById('timeline');
            if (!timeline) return;

            const items = timeline.querySelectorAll('.relative.flex');
            const line = timeline.querySelector('.absolute.left-8, .absolute.left-1\\/2');

            // Set up observer for timeline items
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('timeline-item--visible');
                        this.updateProgress(line, items);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-50px 0px -50px 0px'
            });

            items.forEach(item => {
                item.classList.add('timeline-item');
                const dot = item.querySelector('.w-8.h-8.bg-primary');
                if (dot) dot.classList.add('timeline-dot');
                this.observer.observe(item);
            });

            // Update progress on scroll
            window.addEventListener('scroll', () => {
                requestAnimationFrame(() => this.updateProgress(line, items));
            }, { passive: true });
        },

        updateProgress(line, items) {
            if (!line) return;

            const timelineRect = line.parentElement.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const scrollProgress = Math.max(0, Math.min(1,
                (viewportHeight - timelineRect.top) / (timelineRect.height + viewportHeight)
            ));

            line.style.setProperty('--timeline-progress', `${scrollProgress * 100}%`);
        }
    };

    // Animation Performance Monitor
    const PerformanceMonitor = {
        metrics: {
            frameDrops: 0,
            longFrames: 0,
            animationJank: []
        },

        init() {
            // Only enable in development or with debug flag
            if (!location.search.includes('debug=1')) return;

            this.monitorFrameRate();
            this.logMetrics();
        },

        monitorFrameRate() {
            let lastTime = performance.now();
            let frameCount = 0;

            const measureFrame = () => {
                const now = performance.now();
                const delta = now - lastTime;

                if (delta > 33.33) { // Less than 30fps
                    this.metrics.frameDrops++;
                }
                if (delta > 50) { // Significant jank
                    this.metrics.longFrames++;
                }

                frameCount++;
                lastTime = now;
                requestAnimationFrame(measureFrame);
            };

            requestAnimationFrame(measureFrame);
        },

        logMetrics() {
            setInterval(() => {
                console.log('[PerformanceMonitor]', {
                    ...this.metrics,
                    timestamp: new Date().toISOString()
                });
            }, 5000);
        }
    };

    // Scroll Tracking Module
    const ScrollTracker = {
        trackedSections: new Set(),

        init() {
            // Track when sections come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.trackedSections.has(entry.target.id)) {
                        this.trackedSections.add(entry.target.id);

                        // Track section view
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'section_view', {
                                section_id: entry.target.id,
                                page: window.location.pathname
                            });
                        }
                    }
                });
            }, { threshold: 0.5 });

            // Observe key sections
            document.querySelectorAll('section[id]').forEach(section => {
                observer.observe(section);
            });
        }
    };

    // Time on Page Tracker
    const TimeTracker = {
        startTime: Date.now(),

        init() {
            // Track time when user leaves
            window.addEventListener('beforeunload', () => {
                const timeSpent = Math.round((Date.now() - this.startTime) / 1000);

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        value: timeSpent,
                        event_label: `${timeSpent}s`
                    });
                }
            });
        }
    };

    // Page Loader Handler
    const PageLoader = {
        hide() {
            const loader = document.getElementById('page-loader');
            if (loader) {
                loader.classList.add('page-loader--hidden');
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }
        }
    };

    // ============================================
    // PHASE 4: ADVANCED UX
    // ============================================

    /**
     * 22. ImageBlurUp - Progressive image loading
     */
    const ImageBlurUp = {
        init() {
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
        },

        loadImage(img) {
            const src = img.dataset.src;
            const placeholder = img.dataset.placeholder;

            if (!src) return;

            // Create container if not exists
            let container = img.parentElement;
            if (!container.classList.contains('img-blur-up')) {
                container = document.createElement('div');
                container.className = 'img-blur-up';
                img.parentNode.insertBefore(container, img);
                container.appendChild(img);
            }

            // Add placeholder if provided
            if (placeholder) {
                const placeholderImg = document.createElement('img');
                placeholderImg.src = placeholder;
                placeholderImg.className = 'img-blur-up__placeholder';
                placeholderImg.alt = '';
                container.insertBefore(placeholderImg, img);
            }

            img.classList.add('img-blur-up__img');

            // Load high-res image
            const highResImg = new Image();
            highResImg.onload = () => {
                img.src = src;
                requestAnimationFrame(() => {
                    img.classList.add('loaded');
                });
            };
            highResImg.src = src;
        }
    };

    /**
     * 24. PrefetchOnHover - Preload pages on hover
     */
    const PrefetchOnHover = {
        prefetched: new Set(),

        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('mouseenter', () => {
                    const page = link.getAttribute('href').replace('#', '');
                    this.prefetchPage(page);
                });

                // Also prefetch on focus for keyboard users
                link.addEventListener('focus', () => {
                    const page = link.getAttribute('href').replace('#', '');
                    this.prefetchPage(page);
                });
            });
        },

        prefetchPage(page) {
            if (this.prefetched.has(page)) return;
            if (!CONFIG.AVAILABLE_PAGES.includes(page)) return;

            this.prefetched.add(page);

            // Pre-render by making page elements visible temporarily
            const pageEl = document.getElementById(`page-${page}`);
            if (pageEl) {
                // Force browser to parse and prepare styles
                pageEl.getBoundingClientRect();
            }

            console.log(`[Prefetch] Page "${page}" prepared`);
        }
    };

    /**
     * 25. CharCounter - Character counter for textareas
     */
    const CharCounter = {
        init() {
            document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
                this.addCounter(textarea);
            });
        },

        addCounter(textarea) {
            const maxLength = parseInt(textarea.getAttribute('maxlength'));
            if (!maxLength) return;

            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.innerHTML = `<span>0</span> / ${maxLength}`;

            textarea.parentNode.appendChild(counter);

            textarea.addEventListener('input', () => {
                const current = textarea.value.length;
                const span = counter.querySelector('span');
                span.textContent = current;

                // Update warning states
                counter.classList.remove('char-counter--warning', 'char-counter--error');
                if (current >= maxLength * 0.9) {
                    counter.classList.add('char-counter--error');
                } else if (current >= maxLength * 0.8) {
                    counter.classList.add('char-counter--warning');
                }
            });
        }
    };

    /**
     * 26. EmptyState - Render empty states
     */
    const EmptyState = {
        render(container, options = {}) {
            const {
                icon = 'inbox',
                title = 'Không có dữ liệu',
                description = '',
                actionText = '',
                actionHref = '',
                actionCallback = null
            } = options;

            const actionHtml = actionText
                ? `<a href="${actionHref}" class="empty-state__action" ${actionCallback ? `onclick="${actionCallback}; return false;"` : ''}>
                     <span class="material-symbols-outlined">arrow_forward</span>
                     ${actionText}
                   </a>`
                : '';

            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <h3 class="empty-state__title">${title}</h3>
                    ${description ? `<p class="empty-state__description">${description}</p>` : ''}
                    ${actionHtml}
                </div>
            `;
        }
    };

    /**
     * 27. ErrorBoundary - Error handling wrapper
     */
    const ErrorBoundary = {
        wrap(fn, fallbackSelector, errorMessage = 'Đã có lỗi xảy ra') {
            try {
                return fn();
            } catch (error) {
                console.error('[ErrorBoundary]', error);
                this.renderFallback(fallbackSelector, error, errorMessage);
                return null;
            }
        },

        renderFallback(selector, error, message) {
            const container = document.querySelector(selector);
            if (!container) return;

            container.innerHTML = `
                <div class="error-boundary">
                    <div class="error-boundary__icon">
                        <span class="material-symbols-outlined">error_outline</span>
                    </div>
                    <h3 class="error-boundary__title">${message}</h3>
                    <p class="error-boundary__message">${error.message}</p>
                    <div class="error-boundary__actions">
                        <button onclick="location.reload()" class="btn btn-primary">
                            <span class="material-symbols-outlined">refresh</span>
                            Tải lại trang
                        </button>
                        <a href="mailto:contact@aivan.vn" class="btn btn-secondary">
                            Liên hệ hỗ trợ
                        </a>
                    </div>
                </div>
            `;
        },

        // Global error handler
        init() {
            window.addEventListener('error', (e) => {
                console.error('[Global Error]', e.error);
                // Don't render fallback for every error, just log
            });

            window.addEventListener('unhandledrejection', (e) => {
                console.error('[Unhandled Rejection]', e.reason);
            });
        }
    };

    /**
     * 28. Tooltip - Initialize tooltips
     */
    const Tooltip = {
        init() {
            // Add tooltips to icons without text labels
            document.querySelectorAll('[data-icon]').forEach(el => {
                if (!el.hasAttribute('data-tooltip')) {
                    const iconName = el.getAttribute('data-icon');
                    const tooltipText = this.getTooltipText(iconName);
                    if (tooltipText) {
                        el.setAttribute('data-tooltip', tooltipText);
                    }
                }
            });

            // Add tooltips to navigation icons
            document.querySelectorAll('nav .material-symbols-outlined').forEach(icon => {
                const link = icon.closest('a');
                if (link && !link.hasAttribute('data-tooltip')) {
                    const text = link.textContent.trim();
                    if (text) {
                        link.setAttribute('data-tooltip', text);
                    }
                }
            });
        },

        getTooltipText(iconName) {
            const tooltips = {
                'home': 'Trang chủ',
                'search': 'Tìm kiếm',
                'menu': 'Menu',
                'close': 'Đóng',
                'settings': 'Cài đặt',
                'help': 'Trợ giúp',
                'info': 'Thông tin',
                'share': 'Chia sẻ',
                'favorite': 'Yêu thích',
                'bookmark': 'Lưu',
                'download': 'Tải xuống',
                'upload': 'Tải lên',
                'edit': 'Chỉnh sửa',
                'delete': 'Xóa',
                'add': 'Thêm mới',
                'remove': 'Xóa',
                'check': 'Xác nhận',
                'check_circle': 'Hoàn thành',
                'warning': 'Cảnh báo',
                'error': 'Lỗi',
                'arrow_back': 'Quay lại',
                'arrow_forward': 'Tiếp theo',
                'arrow_upward': 'Lên trên',
                'arrow_downward': 'Xuống dưới'
            };
            return tooltips[iconName];
        }
    };

    // ============================================
    // END PHASE 4
    // ============================================

    // ============================================
    // PHASE 3: CONVERSION & POLISH
    // ============================================

    /**
     * 14. ExitIntent - Exit intent modal
     */
    const ExitIntent = {
        shown: false,
        COOLDOWN: 24 * 60 * 60 * 1000, // 24 hours

        init() {
            // Check if recently shown
            const lastShown = localStorage.getItem('exit-modal-shown');
            if (lastShown && Date.now() - parseInt(lastShown) < this.COOLDOWN) {
                return;
            }

            document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
        },

        handleMouseOut(e) {
            if (this.shown) return;

            // Mouse leaving viewport toward top
            if (e.clientY < 0 && e.relatedTarget === null) {
                this.show();
            }
        },

        show() {
            this.shown = true;
            const modal = document.getElementById('exit-modal');
            if (modal) {
                modal.hidden = false;
                setTimeout(() => modal.classList.add('exit-modal--active'), 10);
                ARIAAnnouncer.announce('Bạn có một ưu đãi đặc biệt đang chờ!', 'polite');
            }
        },

        close(event) {
            // If event provided, only close if clicking overlay
            if (event && event.target !== event.currentTarget) return;

            const modal = document.getElementById('exit-modal');
            if (modal) {
                modal.classList.remove('exit-modal--active');
                setTimeout(() => {
                    modal.hidden = true;
                }, 300);
            }

            // Save to localStorage
            localStorage.setItem('exit-modal-shown', Date.now().toString());
        },

        claimOffer() {
            this.close();
            FormHandler.openModal('consultation-modal');

            // Track conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'exit_intent_claimed');
            }
        }
    };

    /**
     * 15. SocialProof - Social proof notifications
     */
    const SocialProof = {
        notifications: [
            { name: 'Nguyễn Văn A', action: 'vừa đăng ký tư vấn', time: '2 phút trước', avatar: 'NA' },
            { name: 'Trần Thị B', action: 'vừa hoàn thành bài đánh giá', time: '5 phút trước', avatar: 'TB' },
            { name: 'Lê Minh C', action: 'vừa tải tài liệu AI', time: '8 phút trước', avatar: 'LC' },
            { name: 'Phạm Thị D', action: 'vừa đăng ký newsletter', time: '12 phút trước', avatar: 'PD' },
            { name: 'Hoàng Văn E', action: 'vừa nhận báo giá', time: '15 phút trước', avatar: 'HE' }
        ],
        container: null,
        timer: null,

        init() {
            this.container = document.getElementById('social-proof-container');
            if (!this.container) return;

            // Show first notification after 10 seconds
            setTimeout(() => this.show(), 10000);

            // Continue showing notifications
            this.timer = setInterval(() => {
                if (Math.random() > 0.3) { // 70% chance to show
                    this.show();
                }
            }, 25000);
        },

        show() {
            if (!this.container) return;

            const notification = this.notifications[Math.floor(Math.random() * this.notifications.length)];
            const element = this.createNotificationElement(notification);

            this.container.appendChild(element);

            // Remove after animation completes (8s + fade out)
            setTimeout(() => {
                element.remove();
            }, 8500);
        },

        createNotificationElement(data) {
            const div = document.createElement('div');
            div.className = 'social-proof__item';
            div.innerHTML = `
                <div class="social-proof__avatar">${data.avatar}</div>
                <div class="social-proof__content">
                    <div class="social-proof__name">${data.name}</div>
                    <div class="social-proof__action">${data.action}</div>
                    <div class="social-proof__time">${data.time}</div>
                </div>
            `;
            return div;
        },

        destroy() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        }
    };

    /**
     * 18. FloatingLabels - Initialize floating labels for forms
     */
    const FloatingLabels = {
        init() {
            // Skip floating labels - form already has placeholders and icons
            // This prevents label overlapping with icons
            return;
        }
    };

    /**
     * 19. SkeletonLoader - Skeleton screen loader
     */
    const SkeletonLoader = {
        init() {
            // Add skeleton styles to elements that will load content
            const containers = document.querySelectorAll('[data-skeleton]');
            containers.forEach(container => {
                this.showSkeleton(container);
            });
        },

        showSkeleton(container) {
            const type = container.dataset.skeleton || 'text';
            const count = parseInt(container.dataset.skeletonCount) || 1;

            let html = '';
            for (let i = 0; i < count; i++) {
                html += `<div class="skeleton skeleton--${type}"></div>`;
            }

            container.innerHTML = html;
        },

        hideSkeleton(container, content) {
            container.innerHTML = content;
            container.removeAttribute('data-skeleton');
        }
    };

    /**
     * 20. SuccessAnimation - Success checkmark animation
     */
    const SuccessAnimation = {
        render(container, options = {}) {
            const { title = 'Thành công!', message = '' } = options;

            container.innerHTML = `
                <div class="success-message">
                    <svg class="success-checkmark" viewBox="0 0 52 52">
                        <circle class="success-checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="success-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h3 class="success-message__title">${title}</h3>
                    ${message ? `<p class="success-message__text">${message}</p>` : ''}
                </div>
            `;
        }
    };

    // ============================================
    // END PHASE 3
    // ============================================

    // ============================================
    // PHASE 2: NAVIGATION & FLOW
    // ============================================

    /**
     * 8. ScrollSpy - Active section indicator
     */
    const ScrollSpy = {
        observer: null,
        currentSection: null,

        init() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link[data-section]');
            if (!sections.length || !navLinks.length) return;

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.setActiveSection(entry.target.id);
                    }
                });
            }, { threshold: 0.3, rootMargin: '-50px 0px -50% 0px' });

            sections.forEach(section => this.observer.observe(section));
        },

        setActiveSection(sectionId) {
            this.currentSection = sectionId;
            document.querySelectorAll('.nav-link[data-section]').forEach(link => {
                link.classList.toggle('active', link.dataset.section === sectionId);
            });
        }
    };

    /**
     * 9. StickyCTA - Sticky call-to-action bar
     */
    const StickyCTA = {
        init() {
            const stickyCta = document.getElementById('sticky-cta');
            const hero = document.querySelector('section[aria-labelledby="hero-title"]');
            if (!stickyCta || !hero) return;

            const observer = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) {
                    stickyCta.hidden = false;
                    // Small delay to allow display:block to apply before adding class
                    setTimeout(() => {
                        stickyCta.classList.add('sticky-cta--visible');
                        document.body.classList.add('has-sticky-cta');
                    }, 10);
                } else {
                    stickyCta.classList.remove('sticky-cta--visible');
                    document.body.classList.remove('has-sticky-cta');
                    setTimeout(() => stickyCta.hidden = true, 400);
                }
            }, { threshold: 0 });

            observer.observe(hero);
        }
    };

    /**
     * 10. BackToTop - Back to top button
     */
    const BackToTop = {
        button: null,
        scrollThreshold: 500,

        init() {
            this.button = document.getElementById('back-to-top');
            if (!this.button) return;

            window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
            this.handleScroll();
        },

        handleScroll() {
            const shouldShow = window.scrollY > this.scrollThreshold;
            if (shouldShow && this.button.hidden) {
                this.button.hidden = false;
                requestAnimationFrame(() => this.button.classList.add('back-to-top--visible'));
            } else if (!shouldShow && !this.button.hidden) {
                this.button.classList.remove('back-to-top--visible');
                setTimeout(() => this.button.hidden = true, 300);
            }
        }
    };

    /**
     * 11. BreadcrumbManager - Dynamic breadcrumb navigation
     */
    const BreadcrumbManager = {
        init() {
            this.update(Router.currentPage);
            window.addEventListener('pagechange', (e) => this.update(e.detail.page));
        },

        update(page) {
            const containers = document.querySelectorAll('[data-breadcrumb-container]');
            containers.forEach(container => {
                container.innerHTML = this.render(this.getBreadcrumbs(page));
            });
        },

        getBreadcrumbs(page) {
            const crumbs = {
                home: [
                    { label: 'Trang chủ', active: true }
                ],
                services: [
                    { label: 'Trang chủ', href: '#home' },
                    { label: 'Chọn lĩnh vực', active: true }
                ],
                results: [
                    { label: 'Trang chủ', href: '#home' },
                    { label: 'Lĩnh vực', href: '#services' },
                    { label: 'Chiến lược', active: true }
                ]
            };
            return crumbs[page] || crumbs.home;
        },

        render(breadcrumbs) {
            return breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                if (isLast) {
                    return `<span class="breadcrumb__current">${crumb.label}</span>`;
                }
                return `
                    <span class="breadcrumb__item">
                        <a href="${crumb.href}" class="breadcrumb__link" onclick="navigateTo('${crumb.href.replace('#', '')}'); return false;">${crumb.label}</a>
                        <span class="material-symbols-outlined breadcrumb__separator" style="font-size: 14px;">chevron_right</span>
                    </span>
                `;
            }).join('');
        }
    };

    /**
     * 12. SwipeHandler - Touch gesture support
     */
    const SwipeHandler = {
        touchStartX: 0,
        touchEndX: 0,
        touchStartY: 0,
        touchEndY: 0,
        minSwipeDistance: 50,
        maxVerticalDistance: 100,

        init() {
            // Only enable on touch devices
            if (!('ontouchstart' in window)) return;

            document.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.touchEndY = e.changedTouches[0].screenY;
                this.handleSwipe();
            }, { passive: true });
        },

        handleSwipe() {
            const deltaX = this.touchEndX - this.touchStartX;
            const deltaY = this.touchEndY - this.touchStartY;

            // Ignore if vertical swipe is too large (scrolling)
            if (Math.abs(deltaY) > this.maxVerticalDistance) return;

            if (Math.abs(deltaX) < this.minSwipeDistance) return;

            const pages = ['home', 'services', 'results'];
            const currentIndex = pages.indexOf(Router.currentPage);

            if (deltaX > 0 && currentIndex > 0) {
                // Swipe right - go to previous page
                navigateTo(pages[currentIndex - 1]);
                ARIAAnnouncer.announce(`Đã chuyển đến ${pages[currentIndex - 1]}`);
            } else if (deltaX < 0 && currentIndex < pages.length - 1) {
                // Swipe left - go to next page
                navigateTo(pages[currentIndex + 1]);
                ARIAAnnouncer.announce(`Đã chuyển đến ${pages[currentIndex + 1]}`);
            }
        }
    };

    // ============================================
    // END PHASE 2
    // ============================================

    // ============================================
    // PHASE 1: FOUNDATION - UX/UI MODULES
    // ============================================

    /**
     * 1. RippleEffect - Optimized CSS-only ripple animation
     */
    const RippleEffect = {
        init() {
            // Use CSS-only ripple for better performance
            document.querySelectorAll('button, .btn, [class*="button"]').forEach(button => {
                button.classList.add('ripple-container');
            });
        }
    };

    /**
     * 3. RealtimeValidation - Inline form validation
     */
    const RealtimeValidation = {
        init() {
            document.querySelectorAll('form input, form textarea, form select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearError(field));
            });
        },

        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let message = '';

            if (field.required && !value) {
                isValid = false;
                message = 'Vui lòng điền thông tin này';
            } else if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Email không hợp lệ';
                }
            } else if (field.type === 'tel' && value) {
                const phoneRegex = /^[0-9\s]{10,12}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    message = 'Số điện thoại không hợp lệ';
                }
            }

            this.updateFieldUI(field, isValid, message);
            return isValid;
        },

        updateFieldUI(field, isValid, message) {
            const form = field.closest('form');
            if (!form) return;

            const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);

            if (isValid) {
                field.classList.remove('form__input--error');
                field.classList.add('form__input--success');
                if (errorEl) errorEl.textContent = '';
            } else {
                field.classList.add('form__input--error');
                field.classList.remove('form__input--success');
                if (errorEl) errorEl.textContent = message;
            }
        },

        clearError(field) {
            field.classList.remove('form__input--error');
        }
    };

    /**
     * 4. PhoneMask - Phone input formatting
     */
    const PhoneMask = {
        init() {
            document.querySelectorAll('input[type="tel"]').forEach(input => {
                input.addEventListener('input', (e) => this.handleInput(e));
                input.addEventListener('keydown', (e) => this.handleKeydown(e));
            });
        },

        handleInput(e) {
            const input = e.target;
            let value = input.value.replace(/\D/g, '');

            if (value.length > 11) value = value.slice(0, 11);

            // Format: 0123 456 789
            if (value.length >= 4 && value.length <= 6) {
                value = value.replace(/(\d{1,4})(\d+)/, '$1 $2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{1,4})(\d{3})(\d+)/, '$1 $2 $3');
            }

            input.value = value;
        },

        handleKeydown(e) {
            // Allow: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) ||
                (e.keyCode === 67 && e.ctrlKey === true) ||
                (e.keyCode === 86 && e.ctrlKey === true) ||
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        }
    };

    /**
     * 6. ARIAAnnouncer - Screen reader announcements
     */
    const ARIAAnnouncer = {
        init() {
            // Already have live regions in HTML
        },

        announce(message, priority = 'polite') {
            const element = document.getElementById(`aria-live-${priority}`);
            if (element) {
                element.textContent = '';
                setTimeout(() => element.textContent = message, 100);
                setTimeout(() => element.textContent = '', 1000);
            }
        },

        announceFormSuccess(formType) {
            const messages = {
                consultation: 'Đã gửi yêu cầu tư vấn thành công. Chúng tôi sẽ liên hệ với bạn sớm.',
                newsletter: 'Đã đăng ký nhận tin thành công.',
                quick: 'Đã gửi tin nhắn thành công.'
            };
            this.announce(messages[formType] || 'Đã gửi thành công.', 'polite');
        },

        announceFormError(message) {
            this.announce(message || 'Có lỗi xảy ra. Vui lòng thử lại.', 'assertive');
        }
    };

    // ============================================
    // END PHASE 1 MODULES
    // ============================================

    // Initialize Application
    function init() {
        // Initialize modules
        Router.init();
        IndustrySelector.init();
        ImageHandler.init();
        Accessibility.init();
        FormHandler.init();
        ROICalculator.init();
        CaseStudiesHandler.init();
        ToolComparisonHandler.init();

        // Initialize Phase 1 UX modules
        RippleEffect.init();
        RealtimeValidation.init();
        PhoneMask.init();

        // Initialize Phase 2 Navigation modules
        ScrollSpy.init();
        StickyCTA.init();
        BackToTop.init();
        BreadcrumbManager.init();
        SwipeHandler.init();

        // Initialize Phase 3 Conversion modules
        ExitIntent.init();
        SocialProof.init();
        FloatingLabels.init();
        SkeletonLoader.init();

        // Initialize Phase 4 Advanced UX modules
        ImageBlurUp.init();
        PrefetchOnHover.init();
        CharCounter.init();
        ErrorBoundary.init();
        Tooltip.init();

        // Initialize tracking and animations
        ScrollTracker.init();
        TimeTracker.init();
        ScrollAnimation.init();
        TimelineAnimation.init();
        PerformanceMonitor.init();

        // Expose global functions (for onclick handlers)
        window.navigateTo = (page) => Router.showPage(page);
        window.selectIndustry = (industry) => IndustrySelector.selectIndustry(industry);
        window.showComingSoon = (feature) => ComingSoon.show(feature);
        window.FormHandler = FormHandler;
        window.QuizHandler = QuizHandler;
        window.trackEvent = (name, params) => FormHandler.trackEvent(name, params);
        window.ResultsRenderer = ResultsRenderer;
        window.ARIAAnnouncer = ARIAAnnouncer;
        window.ExitIntent = ExitIntent;
        window.SuccessAnimation = SuccessAnimation;
        window.EmptyState = EmptyState;
        window.ErrorBoundary = ErrorBoundary;

        // Toggle service card details
        window.toggleServiceCard = (button) => {
            const card = button.closest('.service-card');
            const details = card.querySelector('.service-card__details');
            const icon = button.querySelector('.material-symbols-outlined');
            const text = button.querySelector('span:first-child');

            if (details.classList.contains('hidden')) {
                details.classList.remove('hidden');
                icon.style.transform = 'rotate(180deg)';
                text.textContent = 'Thu gọn';
            } else {
                details.classList.add('hidden');
                icon.style.transform = 'rotate(0deg)';
                text.textContent = 'Xem chi tiết';
            }
        };

        // Tab switching for Interactive Tools section
        window.switchTab = (tabName) => {
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById(`tab-${tabName}`).classList.add('active');

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            const activeContent = document.getElementById(`content-${tabName}`);
            activeContent.classList.remove('hidden');
            activeContent.classList.add('active');

            // Save preference to localStorage
            localStorage.setItem('aivan-active-tab', tabName);

            // Track tab switch event
            FormHandler.trackEvent('tab_switch', { tab: tabName });
        };

        // Restore last active tab on page load
        const lastTab = localStorage.getItem('aivan-active-tab');
        if (lastTab && (lastTab === 'quiz' || lastTab === 'roi')) {
            window.switchTab(lastTab);
        }

        // ============================================
        // Sticky Summary for Results Page
        // ============================================
        const StickySummary = {
            init() {
                this.element = document.getElementById('sticky-summary');
                if (!this.element) return;

                this.setupScrollListener();
                this.updateContent();
            },

            setupScrollListener() {
                let lastScrollY = window.scrollY;
                const threshold = 300; // Show after scrolling 300px
                const implementCard = document.getElementById('implement-heading')?.closest('section');

                window.addEventListener('scroll', () => {
                    const currentScrollY = window.scrollY;

                    // Hide sticky-summary when Implementation Card is visible in viewport
                    let hideNearImplementCard = false;
                    if (implementCard) {
                        const rect = implementCard.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        // Hide when Implementation Card is at least 50% visible
                        hideNearImplementCard = rect.top < windowHeight * 0.7 && rect.bottom > 0;
                    }

                    const shouldShow = currentScrollY > threshold && !hideNearImplementCard;

                    if (shouldShow && !this.element.classList.contains('visible')) {
                        this.element.classList.add('visible');
                    } else if (!shouldShow && this.element.classList.contains('visible')) {
                        this.element.classList.remove('visible');
                    }

                    lastScrollY = currentScrollY;
                }, { passive: true });
            },

            updateContent() {
                // Update industry name
                const industryName = document.getElementById('results-industry-name');
                const stickyIndustry = document.getElementById('sticky-industry');
                if (industryName && stickyIndustry) {
                    stickyIndustry.textContent = industryName.textContent;
                }
            },

            hide() {
                this.element?.classList.remove('visible');
            }
        };

        // Initialize Sticky Summary on results page
        if (document.getElementById('sticky-summary')) {
            StickySummary.init();
        }

        // ============================================
        // Industry Card Preview Data & Handler
        // ============================================
        const IndustryPreviewData = {
            programming: {
                title: 'Giải pháp cho Lập trình',
                benefits: ['Tăng tốc code 5x với AI', 'Auto-complete thông minh', 'Review code tự động'],
                tools: ['GitHub Copilot', 'Cursor', 'Codeium', 'TabNine'],
                timeline: '1-2 tuần'
            },
            trading: {
                title: 'Giải pháp cho Trading',
                benefits: ['Phân tích kỹ thuật AI', 'Bot giao dịch tự động', 'Quản lý rủi ro thông minh'],
                tools: ['TradingView', '3Commas', 'Tickeron', 'QuantConnect'],
                timeline: '2-4 tuần'
            },
            'personal-assistant': {
                title: 'Giải pháp Trợ lý cá nhân',
                benefits: ['Quản lý thời gian thông minh', 'Ghi chú và tóm tắt AI', 'Research tự động'],
                tools: ['Notion AI', 'Otter.ai', 'Reclaim AI', 'Perplexity'],
                timeline: '1-2 tuần'
            }
        };

        const IndustryCardHandler = {
            init() {
                document.querySelectorAll('.industry-card').forEach(card => {
                    const input = card.querySelector('input[type="radio"]');
                    if (!input) return;

                    const industry = input.value;
                    const previewData = IndustryPreviewData[industry];

                    if (previewData) {
                        this.createPreview(card, previewData);
                    }
                });
            },

            createPreview(card, data) {
                const preview = document.createElement('div');
                preview.className = 'industry-card__preview';
                preview.innerHTML = `
                    <h4 class="text-white font-bold mb-2">${data.title}</h4>
                    <ul class="space-y-1 mb-3">
                        ${data.benefits.map(b => `
                            <li class="text-white/70 text-xs flex items-center gap-1">
                                <span class="material-symbols-outlined text-primary text-xs">check</span>
                                ${b}
                            </li>
                        `).join('')}
                    </ul>
                    <div class="flex items-center justify-between pt-2 border-t border-white/10">
                        <span class="text-text-secondary text-xs">${data.tools.length} công cụ</span>
                        <span class="text-primary text-xs font-medium">${data.timeline}</span>
                    </div>
                `;
                card.appendChild(preview);
            }
        };

        // Initialize Industry Card hover previews
        IndustryCardHandler.init();

        // Hide page loader
        PageLoader.hide();

        // Mark as initialized
        document.documentElement.classList.add('app-initialized');

        console.log('[App] Initialized successfully');
        console.log('[Analytics] Tracking enabled');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle errors globally
    window.addEventListener('error', (e) => {
        console.error('[App] Global error:', e.message);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('[App] Unhandled rejection:', e.reason);
    });

})();
