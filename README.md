# Smart Product Name Generator 🎯

An AI-powered tool to generate creative product names using artificial intelligence.

<div align="center">
  <img src="public/logo.svg" alt="Product Name AI Logo" width="120" />
</div>

## ✨ Features

- 🤖 Smart name generation using OpenAI GPT
- 🔄 Automatic product information retrieval from URLs
- ✍️ Manual product information input support
- 📏 Adjustable name length (short, medium, long)
- 🎯 Customization preferences for including:
  - Brand names
  - Categories
  - Product features
- 🎨 Modern and responsive UI
- 📱 Mobile and desktop compatible
- 🔍 Collapsible product images and attributes sections
- 📋 One-click copy functionality for generated names
- 🔒 Secure API handling through Helicone
- 📊 Usage statistics with Redis
- 📈 API usage monitoring and analytics

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Helicone API key (for OpenAI API access and monitoring)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jozi/product-name-ai.git
cd product-name-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Set up environment variables in `.env.local`:
```env
OPENAI_API_KEY=your_openai_key
HELICONE_API_KEY=your_helicone_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```


6. Open in browser:
```
http://localhost:3000
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 13+](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Static type checking
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **AI**: [OpenAI GPT](https://openai.com/) - Advanced language model
- **API Management**: [Helicone](https://helicone.ai/) - OpenAI API key management and analytics
- **UI Components**: [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons

## 📝 Usage Guide

1. **Input Product Information**
   - Enter a Basalam product URL for automatic information retrieval
   - Or manually input product details:
     - Product name
     - Description
     - Category

2. **Configure Generation Settings**
   - Select desired name length (short/medium/long)
   - Choose preferences:
     - Include brand name
     - Include category
     - Include features

3. **Generate Names**
   - Click the "Generate Names" button
   - Wait for AI to process and generate creative names
   - View generated names with explanations

4. **Use Generated Names**
   - Copy names with one click
   - View reasoning behind each suggestion
   - Generate more variations as needed

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

- API keys are securely handled through environment variables
- All API calls are proxied through Helicone for additional security
- No sensitive data is stored or logged

## 🚀 Deployment

The application can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjozi%2Fproduct-name-ai)

Remember to set up your environment variables in your Vercel project settings.

## 📞 Contact & Support

- **Issues**: Report bugs or suggest features through [GitHub Issues](https://github.com/jozi/product-name-ai/issues)
- **Email**: Contact the maintainer at [hosein.jozi@gmail.com](mailto:hosein.jozi@gmail.com)

## ⭐ Show Your Support

If you find this project useful, please consider giving it a star on GitHub!

