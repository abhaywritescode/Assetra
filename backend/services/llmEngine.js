const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
require('dotenv').config();

const systemPrompt = `You are an expert data analyst and receipt data extraction engine for Assetra.

Analyze the provided receipt/invoice text and extract all information explicitly present.

STRICT RULES:
1. Return ONLY valid JSON. Do not return Markdown, explanations, or code fences.
2. Currency context: Assume Indian Rupees (₹) / INR for all monetary values unless explicitly stated otherwise. Monetary values MUST be extracted as numbers without currency symbols.
3. If multiple products/items are present, return each as a separate object inside "items".
4. Smart Categorization: Automatically determine a high-level category for each item based on its name and context. Use categories like: "Food & Dining", "Electronics", "Software", "Office Supplies", "Apparel", "Home & Garden", "Groceries", "Health & Beauty", "Automotive", "Travel", or "Other".
5. Comprehensive Merchant Data: Extract the Retailer/Store Name, Brand, and tax identifiers (like GSTIN, VAT, or TIN) if present.
6. Dynamic Asset Metadata: Extract item-specific details based on the category. Store these in a "metadata" object inside the item.
   - For "Electronics": Extract model number, serial number, storage capacity, RAM, warranty periods, etc.
   - For "Apparel": Extract size, color, material, etc.
   - For "Food & Dining": Extract nothing special, leave metadata empty.
7. Preserve the original meaning. Normalize dates to YYYY-MM-DD.
8. If a field is missing, unreadable, or not present, return null. For unclear text, use null rather than guessing.
9. Predictive AI Workflow: Evaluate each extracted item and output boolean flags indicating if the item typically requires tracking.
   - requires_warranty: true if it's an electronic, appliance, or high-value physical good. EXPLICITLY false for consumables, food, dining, and basic groceries.
   - requires_return_window: true if it's a physical good that can typically be returned (apparel, electronics, home goods, etc.). EXPLICITLY false for food, perishables, consumables, digital services, dining, and basic groceries.
   - requires_subscription: true if it's a recurring payment, SaaS, streaming service, or membership. EXPLICITLY false for consumables, food, dining, and basic groceries.

Return EXACTLY this JSON structure:

{{
  "merchant": {{
    "name": null,
    "address": null,
    "phone": null,
    "email": null,
    "website": null,
    "gstin": null
  }},
  "receipt": {{
    "receipt_number": null,
    "invoice_number": null,
    "order_number": null,
    "purchase_date": null,
    "purchase_time": null,
    "currency": "INR",
    "subtotal": null,
    "discount": null,
    "tax": null,
    "shipping": null,
    "total_amount": null,
    "payment_method": null
  }},
  "items": [
    {{
      "product_name": null,
      "brand": null,
      "category": null,
      "quantity": null,
      "unit_price": null,
      "total_price": null,
      "serial_number": null,
      "requires_warranty": false,
      "requires_return_window": false,
      "requires_subscription": false,
      "metadata": {{}} 
    }}
  ],
  "warranty": {{
    "mentioned": null,
    "duration": null,
    "coverage": null
  }},
  "return_policy": {{
    "mentioned": null,
    "period": null,
    "deadline": null
  }}
}}`;

const model = new ChatGoogleGenerativeAI({
    model: 'gemini-3.5-flash-lite',
    temperature: 0.2
});

const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    ['human', '{input}']
]);

const chain = prompt.pipe(model);

module.exports = chain;
