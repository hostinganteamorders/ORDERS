# Digital Solutions Company - Next.js App with AI ChatBot
droid --resume 7c030f22-e739-4dac-a68b-2cb68128a370
This is a modern Next.js application for a digital solutions company, featuring an integrated AI chatbot.

## 🚀 Features

- **Modern Design**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **AI ChatBot**: Integrated chatbot for intelligent conversations
- **Responsive Design**: Mobile-first approach with beautiful animations
- **3D Elements**: Interactive 3D components using Three.js
- **Contact Forms**: Email integration with EmailJS
- **Multiple Pages**: Portfolio, Services, Team, Pricing, and Contact pages

## 🤖 AI ChatBot Features

- **Cloud AI**: Powered by advanced AI models via Algion API
- **Real-time Chat**: Instant responses with typing indicators
- **Persistent History**: Chat history saved in localStorage
- **Error Handling**: Graceful error handling with helpful messages
- **Modern UI**: Sleek chat interface with animations
- **Mobile Responsive**: Works perfectly on all devices

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **API Key** from Algion (https://api.algion.dev)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd my-next-app

# Install dependencies
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy the example file
cp .env.example .env.local
```

Then edit `.env.local` and add your API credentials:

```env
OPENAI_API_KEY=your_algion_api_key_here
OPENAI_BASE_URL=https://api.algion.dev/v1
OPENAI_MODEL=gpt-5.1
```

**Important**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing the ChatBot

1. Visit [http://localhost:3000/chatbot-test](http://localhost:3000/chatbot-test) for the test interface
2. Or look for the AI chat button in the bottom-right corner of any page
3. Click to open the chat window and start chatting with Owen, the AI assistant!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/          # ChatBot API endpoint
│   ├── chatbot-test/      # ChatBot test page
│   └── [other pages]/     # Portfolio, Team, etc.
├── components/
│   ├── ChatBot.tsx        # Main ChatBot component
│   └── [other components]/
├── lib/
│   └── chatbot.ts         # ChatBot utilities
└── public/
    └── images/            # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file if you need to customize:

```env
# Ollama API URL (default: http://localhost:11434)
OLLAMA_API_URL=http://localhost:11434

# AI Model (default: llama3)
AI_MODEL=llama3
```

### Customizing the ChatBot

#### Change AI Model:
Edit `src/app/api/chat/route.ts` and modify the model name:
```typescript
model: 'llama3', // Change to your preferred model
```

#### Customize System Prompt:
Modify the system message in `src/app/api/chat/route.ts`:
```typescript
{
  role: 'system',
  content: 'Your custom system prompt here...'
}
```

#### Styling:
Edit `src/components/ChatBot.tsx` to customize the appearance.

## 🚨 Troubleshooting

### ChatBot Not Working?

1. **Check Ollama Status**:
   ```bash
   ollama list  # Should show llama3
   ```

2. **Restart Ollama**:
   ```bash
   ollama serve
   ```

3. **Test Connection**:
   Visit [http://localhost:3000/chatbot-test](http://localhost:3000/chatbot-test)

### Common Issues:

- **"Model not found"**: Run `ollama pull llama3`
- **"Service not running"**: Run `ollama serve`
- **Port conflicts**: Make sure ports 3000 and 11434 are available

## 📱 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📦 Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **AI**: Ollama, Llama3
- **Icons**: Heroicons
- **Email**: EmailJS

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy!

**Note**: The AI chatbot will only work locally unless you set up Ollama on your server.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the chatbot functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues with the chatbot setup:

1. Check the [ChatBot Setup Guide](./CHATBOT_SETUP.md)
2. Visit the test page at `/chatbot-test`
3. Ensure Ollama is running with `ollama serve`

---

**Enjoy chatting with your AI assistant! 🤖✨**
=======
# 🌟 ORDERS WEBSITE - Digital Solution for Sustainable Future

<div align="center">
  <img src="public/images/Orders.png" alt="ORDERS Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  **Advanced Digital Technology Partner for Accelerating Business Growth**
  
  [🚀 Features](#-features) • [🌱 EcoDigital](#-ecodigital-initiative) • [📱 Demo](#-live-demo) • [🛠️ Installation](#️-installation) • [📄 Documentation](#-documentation)
</div>

---

## ✨ Overview

ORDERS is a cutting-edge digital technology company specializing in sustainable solutions that drive business acceleration while maintaining environmental responsibility. We combine innovative AI, data analytics, and circular economy principles to create transformative digital experiences.

### 🎯 Why Choose ORDERS?

- **🌍 Eco-Digital Focus** - Sustainable technology solutions that reduce environmental impact
- **🤖 AI-Powered Innovation** - Advanced artificial intelligence for business optimization
- **♻️ Circular Economy** - Supporting waste management and recycling ecosystems
- **🏆 Award Recognition** - AIDEA Nation BRIN finalist with ministerial acknowledgment
- **⚡ Performance-First** - Optimized for speed, accessibility, and user experience
- **📱 Responsive Design** - Seamless experience across all devices

---

## 🚀 Features

### 💼 **Digital Solutions Portfolio**
- **Web Development** - Modern, responsive websites with cutting-edge technology
- **Mobile Applications** - Cross-platform apps with native performance
- **AI Integration** - Machine learning solutions for business intelligence
- **Digital Transformation** - Complete business digitization strategies
- **E-commerce Platforms** - Scalable online stores with advanced features

### 🌱 **EcoDigital Initiative**
- **Sustainable Architecture** - Green hosting and energy-efficient code
- **Carbon Footprint Tracking** - Real-time emissions monitoring and reporting
- **Circular Economy Platform** - Waste management and recycling coordination
- **Environmental Impact Analytics** - Data-driven sustainability insights
- **Green Technology Consulting** - Eco-friendly digital transformation guidance

### 📊 **Business Intelligence**
- **Data Analytics Dashboard** - Real-time business performance monitoring
- **Predictive Analytics** - AI-powered forecasting and trend analysis
- **Custom Reporting** - Tailored insights for strategic decision making
- **Integration Services** - Seamless connection with existing systems
- **Cloud Solutions** - Scalable, secure cloud infrastructure

### 🎨 **Modern Web Experience**
- **Interactive Animations** - Smooth scroll-triggered reveal effects
- **3D Elements** - Three.js integration for immersive experiences
- **Responsive Design** - Mobile-first approach with desktop optimization
- **SEO Optimized** - Search engine friendly architecture
- **Accessibility Compliant** - WCAG 2.1 AA standards adherence

---

## 🌱 EcoDigital Initiative

Our flagship **EcoDigital** program represents our commitment to environmental sustainability through technology:

### 🔄 **Baciraro Recycle Ecosystem**
Partnership with Baciraro Recycle to create a comprehensive circular economy platform:
- **Material Flow Mapping** - Digital tracking of waste streams and sources
- **Data-Driven Classification** - Automated waste categorization and processing
- **Impact Visualization** - Real-time environmental impact dashboards
- **Community Connectivity** - Connecting stakeholders in the recycling chain

### 🏢 **Sustainable Future Workforce**
- **Innovation Labs** - AI and data solutions for resource efficiency
- **Talent Development** - Mentoring programs for sustainability-focused tech skills
- **Green Career Opportunities** - New roles in environmental analytics and design

---

## 🏆 Recognition & Achievements

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="public/images/ecosistem/AI_1.png" width="150" alt="AIDEA Nation">
        <br><strong>AIDEA Nation BRIN Finalist</strong>
        <br><em>National Research and Innovation Agency</em>
      </td>
      <td align="center">
        <img src="public/images/ecosistem/Menteri_1.jpg" width="150" alt="Ministry Recognition">
        <br><strong>Ministerial Recognition</strong>
        <br><em>Tourism Ministry Acknowledgment</em>
      </td>
      <td align="center">
        <img src="public/images/ecosistem/BACIRARO.png" width="150" alt="Ecosystem Partner">
        <br><strong>Ecosystem Partnership</strong>
        <br><em>Baciraro Recycle Integration</em>
      </td>
    </tr>
  </table>
</div>

---

## 📱 Live Demo

Visit our live website: **[ordersapp.tech](https://www.ordersapp.tech)** 

### 🖥️ Page Highlights

- **🏠 Homepage** - Hero slideshow with achievement showcase
- **🌱 EcoDigital** - Sustainability initiative details and ecosystem visualization
- **💼 Portfolio** - Comprehensive project showcase with case studies
- **👥 Team** - Meet our talented development team
- **💰 Pricing** - Transparent service packages and consultation options
- **📞 Contact** - Multiple contact methods and inquiry forms

---

## 🛠️ Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** (18.0 or higher) - [Install Node.js](https://nodejs.org)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/KevinJeremi/ordersnew.git
   cd ordersnew
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   
   # Add your configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=ORDERS

# Email Service (EmailJS)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### EmailJS Setup

1. **Create EmailJS Account** - [emailjs.com](https://emailjs.com)
2. **Create Email Service** - Configure your preferred email provider
3. **Create Email Template** - Design your contact form email template
4. **Get API Keys** - Copy Service ID, Template ID, and Public Key to `.env.local`

---

## 📂 Project Structure

```
src/
├── 🚀 app/                         # Next.js App Router
│   ├── layout.tsx                  # Root layout component
│   ├── page.tsx                    # Homepage
│   ├── contact/page.tsx            # Contact page
│   ├── ecodigital/page.tsx         # EcoDigital initiative
│   ├── portfolio/page.tsx          # Portfolio showcase
│   ├── pricing/page.tsx            # Service pricing
│   ├── team/page.tsx               # Team members
│   └── globals.css                 # Global styles
├── 🎨 components/                   # Reusable UI components
│   ├── Header.tsx                  # Navigation header
│   ├── Footer.tsx                  # Site footer
│   ├── HeroSection.tsx             # Homepage hero with slideshow
│   ├── AboutSection.tsx            # Company overview
│   ├── ServicesSection.tsx         # Services showcase
│   ├── PortfolioSection.tsx        # Portfolio grid
│   ├── TeamSection.tsx             # Team member cards
│   ├── PricingSection.tsx          # Pricing tables
│   ├── ContactSection.tsx          # Contact form
│   ├── EcodigitalSection.tsx       # EcoDigital hero
│   ├── Reveal.tsx                  # Scroll animation wrapper
│   ├── SpotlightCard.tsx           # Interactive card component
│   ├── WhatsAppButton.tsx          # Floating WhatsApp contact
│   └── FloatingActionButtons.tsx   # Floating action buttons
├── 📦 lib/                         # Utility libraries and helpers
└── 🖼️ public/                      # Static assets
    ├── images/                     # Website images
    │   ├── ecosistem/             # EcoDigital related images
    │   ├── portofolio/            # Portfolio project images
    │   ├── sponsor/               # Partner and sponsor logos
    │   ├── services/              # Service illustrations
    │   ├── team/                  # Team member photos
    │   └── pricing/               # Pricing graphics
    └── favicon.ico                 # Site favicon
```

---

## 🎨 Customization

### Branding

Update your business branding in the following files:
- `src/app/layout.tsx` - Site metadata and SEO
- `src/components/Header.tsx` - Navigation and logo
- `src/components/Footer.tsx` - Contact information and social links
- `public/images/logo.png` - Replace with your logo

### Theme Colors

Modify the color scheme in `tailwind.config.ts`:
```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-orange': '#ff6c00',
        'custom-green': '#22c55e',
        'custom-teal': '#14b8a6',
      }
    }
  }
}
```

### Animations

The `Reveal` component provides scroll-triggered animations:
```tsx
import Reveal from '@/components/Reveal';

<Reveal delay={200}>
  <YourContent />
</Reveal>
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   - Add your `.env.local` variables in Vercel dashboard
   - Update `NEXT_PUBLIC_SITE_URL` to your production domain

### Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
out
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🧪 Testing

Run the test suite:
```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build test
npm run build
```

---

## 📊 Performance Optimization

### Built-in Optimizations
- ✅ **Next.js Image Optimization** - Automatic image resizing and WebP conversion
- ✅ **Code Splitting** - Automatic bundle splitting for faster loads
- ✅ **Turbopack** - Ultra-fast bundler for development
- ✅ **Static Site Generation** - Pre-rendered pages for optimal performance
- ✅ **Responsive Images** - Adaptive image loading based on screen size

### Lighthouse Scores
- 🟢 **Performance**: 95+
- 🟢 **Accessibility**: 100
- 🟢 **Best Practices**: 100
- 🟢 **SEO**: 100

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow [Next.js conventions](https://nextjs.org/docs/getting-started)
- Use TypeScript for type safety
- Follow Tailwind CSS utility-first approach
- Ensure responsive design
- Maintain accessibility standards

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🛡️ Security

### Reporting Security Issues
If you discover a security vulnerability, please send an email to [security@orders.com](mailto:security@orders.com). Do not create public issues for security vulnerabilities.

### Security Features
- ✅ Next.js built-in security headers
- ✅ Input validation and sanitization
- ✅ HTTPS enforcement
- ✅ Content Security Policy (CSP)
- ✅ Environment variable protection

---

## 📞 Support & Contact

<div align="center">

### 💬 Get In Touch

[![Website](https://img.shields.io/badge/🌐-Website-blue?style=for-the-badge)](https://orders.com)
[![Email](https://img.shields.io/badge/📧-Email-red?style=for-the-badge)](mailto:contact@orders.com)
[![WhatsApp](https://img.shields.io/badge/📱-WhatsApp-green?style=for-the-badge)](https://wa.me/6287872204325)

### 🏢 Company Information

**ORDERS - Digital Technology Solutions**  
📍 Indonesia  
📱 WhatsApp: [+62 878-7220-4325](https://wa.me/6287872204325)  
📧 Email: [contact@orders.com](mailto:contact@orders.com)  
🌐 Website: [orders.com](https://orders.com)

### 🌐 Connect With Us

[![LinkedIn](https://img.shields.io/badge/LinkedIn-ORDERS-blue?style=for-the-badge&logo=linkedin)](https://linkedin.com/company/orders)
[![Instagram](https://img.shields.io/badge/Instagram-@orders.official-E4405F?style=for-the-badge&logo=instagram)](https://instagram.com/orders.official)
[![Twitter](https://img.shields.io/badge/Twitter-@orders_tech-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/orders_tech)

</div>

---

## 🙏 Acknowledgments

- **Next.js Team** - For the incredible React framework
- **Vercel** - For seamless deployment and hosting
- **Tailwind CSS** - For the utility-first CSS framework
- **React Community** - For continuous innovation and support
- **Three.js** - For 3D graphics capabilities
- **Framer Motion** - For smooth animations
- **Baciraro Recycle** - For environmental partnership
- **BRIN (National Research and Innovation Agency)** - For AIDEA Nation recognition

---

## 📈 Roadmap

### 🔮 Upcoming Features
- [ ] **Multi-language Support** - Indonesian and English localization
- [ ] **Dark/Light Theme** - User preference theme switching
- [ ] **Advanced Analytics** - Detailed visitor and performance tracking
- [ ] **Blog Platform** - Content management for articles and insights
- [ ] **Client Portal** - Dedicated area for project management
- [ ] **API Integration** - RESTful API for third-party integrations

### 🎯 Long-term Goals
- [ ] **AI Chat Assistant** - Intelligent customer support bot
- [ ] **Advanced SEO Tools** - Built-in SEO optimization features
- [ ] **Mobile App** - Native mobile application
- [ ] **Advanced Animations** - More sophisticated motion graphics
- [ ] **Performance Analytics** - Real-time performance monitoring

---

<div align="center">
  <img src="public/images/logo.png" alt="ORDERS Logo" width="60" height="60">
  
  **Developed with ❤️ by [ORDERS Team](https://github.com/KevinJeremi)**
  
  *Innovation & Technology for Sustainable Business Growth*
  
  ⭐ **Star this repository if it helped you!** ⭐
  
  ---
  
  *Building the future, one sustainable solution at a time.*
</div>
>>>>>>> d9b347a145e1982adbef0cb28c7047974dd041da
