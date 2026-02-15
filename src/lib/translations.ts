export type Language = 'zh' | 'en' | 'km';

export const translations = {
  zh: {
    appName: 'SmartInvoice',
    appSubtitle: '柬埔寨发票助手',

    // Auth
    signIn: '登录',
    signUp: '注册',
    signOut: '退出',
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    signingIn: '登录中...',
    creatingAccount: '创建账户中...',
    dontHaveAccount: '没有账户？立即注册',
    alreadyHaveAccount: '已有账户？立即登录',
    createAccount: '创建账户',
    accountCreated: '账户创建成功！',
    canSignInNow: '您现在可以使用凭据登录。',
    goToSignIn: '前往登录',
    getStarted: '开始使用 SmartInvoice',

    // Navigation
    dashboard: '仪表板',
    invoices: '发票',
    customers: '客户',

    // Dashboard
    totalInvoices: '总发票数',
    paidInvoices: '已付款发票',
    totalRevenue: '总收入',
    totalCustomers: '总客户数',
    welcomeToSmartInvoice: '欢迎使用 SmartInvoice',
    welcomeDescription: '使用我们专注于柬埔寨的发票助手高效管理您的发票。创建符合柬埔寨法规的专业发票，并进行适当的税务计算。',
    quickStart: '快速开始',
    quickStartList: ['在客户标签中添加您的客户', '在发票标签中创建您的第一张发票', '导出发票为 PDF 发送'],
    features: '功能',
    featuresList: ['符合柬埔寨税务要求 (10% 增值税)', '专业发票模板', '客户管理'],

    // Invoices
    newInvoice: '新建发票',
    editInvoice: '编辑发票',
    manageInvoices: '管理您的发票',
    searchInvoices: '搜索发票...',
    noInvoicesFound: '未找到发票',
    createFirstInvoice: '创建您的第一张发票',
    backToInvoices: '返回发票列表',
    invoiceNumber: '发票编号',
    issueDate: '开票日期',
    dueDate: '到期日期',
    status: '状态',
    total: '总计',
    actions: '操作',
    customer: '客户',
    view: '查看',
    edit: '编辑',
    delete: '删除',

    // Invoice Status
    draft: '草稿',
    sent: '已发送',
    paid: '已付款',
    cancelled: '已取消',

    // Invoice Form
    selectCustomer: '选择客户',
    addNewCustomer: '+ 添加新客户',
    taxRate: '税率 (%)',
    items: '项目',
    addItem: '添加项目',
    description: '描述',
    quantity: '数量',
    unitPrice: '单价',
    amount: '金额',
    subtotal: '小计',
    tax: '税',
    notes: '备注',
    additionalNotes: '附加备注...',
    cancel: '取消',
    save: '保存',
    saving: '保存中...',
    createInvoice: '创建发票',
    updateInvoice: '更新发票',

    // Customers
    newCustomer: '新建客户',
    editCustomer: '编辑客户',
    manageCustomers: '管理您的客户列表',
    searchCustomers: '搜索客户...',
    noCustomersFound: '未找到客户',
    addFirstCustomer: '添加您的第一个客户',
    backToCustomers: '返回客户列表',
    customerName: '客户名称',
    taxId: '税号 (TIN)',
    address: '地址',
    phone: '电话',
    createCustomer: '创建客户',
    updateCustomer: '更新客户',

    // Invoice View
    invoice: '发票',
    billTo: '账单寄送至',
    supplier: '供应商（卖方）',
    printSavePdf: '打印 / 保存为 PDF',
    thankYou: '感谢您的惠顾！',
    generatedBy: '此发票由 SmartInvoice - 柬埔寨发票助手生成',

    // Validation
    pleaseSelectCustomer: '请选择客户',
    pleaseFillAllItems: '请填写所有项目描述',
    passwordsDontMatch: '密码不匹配',
    passwordTooShort: '密码必须至少 6 个字符',

    // Confirmation
    confirmDelete: '您确定要删除此项吗？',
    deleteCustomerWarning: '删除客户失败。他们可能有关联的发票。',

    // Cambodia Requirements
    supplierInfo: '供应商信息',
    businessName: '企业名称',
    supplierName: '供应商名称',
    supplierAddress: '供应商地址',
    supplierTIN: '供应商税号 (TIN)',
    signature: '签名',
    uploadSignature: '上传签名',
  },

  en: {
    appName: 'SmartInvoice',
    appSubtitle: 'Cambodia Invoice Assistant',

    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signingIn: 'Signing in...',
    creatingAccount: 'Creating account...',
    dontHaveAccount: "Don't have an account? Sign up",
    alreadyHaveAccount: 'Already have an account? Sign in',
    createAccount: 'Create Account',
    accountCreated: 'Account Created!',
    canSignInNow: 'You can now sign in with your credentials.',
    goToSignIn: 'Go to Sign In',
    getStarted: 'Get started with SmartInvoice',

    // Navigation
    dashboard: 'Dashboard',
    invoices: 'Invoices',
    customers: 'Customers',

    // Dashboard
    totalInvoices: 'Total Invoices',
    paidInvoices: 'Paid Invoices',
    totalRevenue: 'Total Revenue',
    totalCustomers: 'Total Customers',
    welcomeToSmartInvoice: 'Welcome to SmartInvoice',
    welcomeDescription: 'Manage your invoices efficiently with our Cambodia-focused invoice assistant. Create professional invoices with proper tax calculations compliant with Cambodia regulations.',
    quickStart: 'Quick Start',
    quickStartList: ['Add your customers in the Customers tab', 'Create your first invoice in the Invoices tab', 'Export invoices as PDF for sending'],
    features: 'Features',
    featuresList: ['Cambodia tax compliance (10% VAT)', 'Professional invoice templates', 'Customer management'],

    // Invoices
    newInvoice: 'New Invoice',
    editInvoice: 'Edit Invoice',
    manageInvoices: 'Manage your invoices',
    searchInvoices: 'Search invoices...',
    noInvoicesFound: 'No invoices found',
    createFirstInvoice: 'Create Your First Invoice',
    backToInvoices: 'Back to Invoices',
    invoiceNumber: 'Invoice #',
    issueDate: 'Issue Date',
    dueDate: 'Due Date',
    status: 'Status',
    total: 'Total',
    actions: 'Actions',
    customer: 'Customer',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',

    // Invoice Status
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid',
    cancelled: 'Cancelled',

    // Invoice Form
    selectCustomer: 'Select a customer',
    addNewCustomer: '+ Add New Customer',
    taxRate: 'Tax Rate (%)',
    items: 'Items',
    addItem: 'Add Item',
    description: 'Description',
    quantity: 'Quantity',
    unitPrice: 'Unit Price',
    amount: 'Amount',
    subtotal: 'Subtotal',
    tax: 'Tax',
    notes: 'Notes',
    additionalNotes: 'Additional notes...',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    createInvoice: 'Create Invoice',
    updateInvoice: 'Update Invoice',

    // Customers
    newCustomer: 'New Customer',
    editCustomer: 'Edit Customer',
    manageCustomers: 'Manage your customer list',
    searchCustomers: 'Search customers...',
    noCustomersFound: 'No customers found',
    addFirstCustomer: 'Add Your First Customer',
    backToCustomers: 'Back to Customers',
    customerName: 'Customer Name',
    taxId: 'Tax ID (TIN)',
    address: 'Address',
    phone: 'Phone',
    createCustomer: 'Create Customer',
    updateCustomer: 'Update Customer',

    // Invoice View
    invoice: 'INVOICE',
    billTo: 'Bill To',
    supplier: 'Supplier (Seller)',
    printSavePdf: 'Print / Save PDF',
    thankYou: 'Thank you for your business!',
    generatedBy: 'This invoice was generated by SmartInvoice - Cambodia Invoice Assistant',

    // Validation
    pleaseSelectCustomer: 'Please select a customer',
    pleaseFillAllItems: 'Please fill in all item descriptions',
    passwordsDontMatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',

    // Confirmation
    confirmDelete: 'Are you sure you want to delete this?',
    deleteCustomerWarning: 'Failed to delete customer. They may have associated invoices.',

    // Cambodia Requirements
    supplierInfo: 'Supplier Information',
    businessName: 'Business Name',
    supplierName: 'Supplier Name',
    supplierAddress: 'Supplier Address',
    supplierTIN: 'Supplier TIN',
    signature: 'Signature',
    uploadSignature: 'Upload Signature',
  },

  km: {
    appName: 'SmartInvoice',
    appSubtitle: 'ជំនួយការវិក្កយបត្រកម្ពុជា',

    // Auth
    signIn: 'ចូល',
    signUp: 'ចុះឈ្មោះ',
    signOut: 'ចាកចេញ',
    email: 'អ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    signingIn: 'កំពុងចូល...',
    creatingAccount: 'កំពុងបង្កើតគណនី...',
    dontHaveAccount: 'មិនមានគណនី? ចុះឈ្មោះ',
    alreadyHaveAccount: 'មានគណនីរួចហើយ? ចូល',
    createAccount: 'បង្កើតគណនី',
    accountCreated: 'គណនីបានបង្កើត!',
    canSignInNow: 'អ្នកអាចចូលបានឥឡូវនេះ។',
    goToSignIn: 'ទៅកាន់ការចូល',
    getStarted: 'ចាប់ផ្តើមជាមួយ SmartInvoice',

    // Navigation
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    invoices: 'វិក្កយបត្រ',
    customers: 'អតិថិជន',

    // Dashboard
    totalInvoices: 'វិក្កយបត្រសរុប',
    paidInvoices: 'វិក្កយបត្របានបង់',
    totalRevenue: 'ប្រាក់ចំណូលសរុប',
    totalCustomers: 'អតិថិជនសរុប',
    welcomeToSmartInvoice: 'សូមស្វាគមន៍មកកាន់ SmartInvoice',
    welcomeDescription: 'គ្រប់គ្រងវិក្កយបត្ររបស់អ្នកប្រកបដោយប្រសិទ្ធភាពជាមួយជំនួយការវិក្កយបត្រសម្រាប់កម្ពុជា។ បង្កើតវិក្កយបត្រអាជីពជាមួយការគណនាពន្ធត្រឹមត្រូវស្របតាមបទប្បញ្ញត្តិកម្ពុជា។',
    quickStart: 'ចាប់ផ្តើមរហ័ស',
    quickStartList: ['បន្ថែមអតិថិជនរបស់អ្នកក្នុងផ្ទាំងអតិថិជន', 'បង្កើតវិក្កយបត្រដំបូងរបស់អ្នកក្នុងផ្ទាំងវិក្កយបត្រ', 'នាំចេញវិក្កយបត្រជា PDF សម្រាប់ផ្ញើ'],
    features: 'លក្ខណៈពិសេស',
    featuresList: ['អនុលោមតាមពន្ធកម្ពុជា (VAT 10%)', 'គំរូវិក្កយបត្រអាជីព', 'ការគ្រប់គ្រងអតិថិជន'],

    // Invoices
    newInvoice: 'វិក្កយបត្រថ្មី',
    editInvoice: 'កែសម្រួលវិក្កយបត្រ',
    manageInvoices: 'គ្រប់គ្រងវិក្កយបត្ររបស់អ្នក',
    searchInvoices: 'ស្វែងរកវិក្កយបត្រ...',
    noInvoicesFound: 'រកមិនឃើញវិក្កយបត្រ',
    createFirstInvoice: 'បង្កើតវិក្កយបត្រដំបូងរបស់អ្នក',
    backToInvoices: 'ត្រឡប់ទៅវិក្កយបត្រ',
    invoiceNumber: 'លេខវិក្កយបត្រ',
    issueDate: 'កាលបរិច្ឆេទចេញ',
    dueDate: 'កាលបរិច្ឆេទផុតកំណត់',
    status: 'ស្ថានភាព',
    total: 'សរុប',
    actions: 'សកម្មភាព',
    customer: 'អតិថិជន',
    view: 'មើល',
    edit: 'កែសម្រួល',
    delete: 'លុប',

    // Invoice Status
    draft: 'សេចក្តីព្រាង',
    sent: 'បានផ្ញើ',
    paid: 'បានបង់',
    cancelled: 'បានលុបចោល',

    // Invoice Form
    selectCustomer: 'ជ្រើសរើសអតិថិជន',
    addNewCustomer: '+ បន្ថែមអតិថិជនថ្មី',
    taxRate: 'អត្រាពន្ធ (%)',
    items: 'ធាតុ',
    addItem: 'បន្ថែមធាតុ',
    description: 'ការពិពណ៌នា',
    quantity: 'បរិមាណ',
    unitPrice: 'តម្លៃឯកតា',
    amount: 'ចំនួនទឹកប្រាក់',
    subtotal: 'សរុបរង',
    tax: 'ពន្ធ',
    notes: 'កំណត់ចំណាំ',
    additionalNotes: 'កំណត់ចំណាំបន្ថែម...',
    cancel: 'បោះបង់',
    save: 'រក្សាទុក',
    saving: 'កំពុងរក្សាទុក...',
    createInvoice: 'បង្កើតវិក្កយបត្រ',
    updateInvoice: 'ធ្វើបច្ចុប្បន្នភាពវិក្កយបត្រ',

    // Customers
    newCustomer: 'អតិថិជនថ្មី',
    editCustomer: 'កែសម្រួលអតិថិជន',
    manageCustomers: 'គ្រប់គ្រងបញ្ជីអតិថិជនរបស់អ្នក',
    searchCustomers: 'ស្វែងរកអតិថិជន...',
    noCustomersFound: 'រកមិនឃើញអតិថិជន',
    addFirstCustomer: 'បន្ថែមអតិថិជនដំបូងរបស់អ្នក',
    backToCustomers: 'ត្រឡប់ទៅអតិថិជន',
    customerName: 'ឈ្មោះអតិថិជន',
    taxId: 'លេខសម្គាល់ពន្ធ (TIN)',
    address: 'អាសយដ្ឋាន',
    phone: 'ទូរសព្ទ',
    createCustomer: 'បង្កើតអតិថិជន',
    updateCustomer: 'ធ្វើបច្ចុប្បន្នភាពអតិថិជន',

    // Invoice View
    invoice: 'វិក្កយបត្រ',
    billTo: 'វិក្កយបត្រទៅ',
    supplier: 'អ្នកផ្គត់ផ្គង់ (អ្នកលក់)',
    printSavePdf: 'បោះពុម្ព / រក្សាទុកជា PDF',
    thankYou: 'សូមអរគុណចំពោះអាជីវកម្មរបស់អ្នក!',
    generatedBy: 'វិក្កយបត្រនេះត្រូវបានបង្កើតដោយ SmartInvoice - ជំនួយការវិក្កយបត្រកម្ពុជា',

    // Validation
    pleaseSelectCustomer: 'សូមជ្រើសរើសអតិថិជន',
    pleaseFillAllItems: 'សូមបំពេញការពិពណ៌នាធាតុទាំងអស់',
    passwordsDontMatch: 'ពាក្យសម្ងាត់មិនត្រូវគ្នា',
    passwordTooShort: 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ',

    // Confirmation
    confirmDelete: 'តើអ្នកប្រាកដថាចង់លុបវាទេ?',
    deleteCustomerWarning: 'បរាជ័យក្នុងការលុបអតិថិជន។ ពួកគេអាចមានវិក្កយបត្រដែលពាក់ព័ន្ធ។',

    // Cambodia Requirements
    supplierInfo: 'ព័ត៌មានអ្នកផ្គត់ផ្គង់',
    businessName: 'ឈ្មោះអាជីវកម្ម',
    supplierName: 'ឈ្មោះអ្នកផ្គត់ផ្គង់',
    supplierAddress: 'អាសយដ្ឋានអ្នកផ្គត់ផ្គង់',
    supplierTIN: 'លេខសម្គាល់ពន្ធអ្នកផ្គត់ផ្គង់ (TIN)',
    signature: 'ហត្ថលេខា',
    uploadSignature: 'ផ្ទុកហត្ថលេខា',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.en): string {
  return translations[lang][key] || translations.en[key] || key;
}
