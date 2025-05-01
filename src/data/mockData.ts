
import { Article, Category, Quiz, Achievement } from '@/types';

export const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '📚' }
];

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Artificial Intelligence in Healthcare',
    summary: 'AI is revolutionizing healthcare with predictive analytics and personalized treatment plans.',
    content: `
      <p>Artificial intelligence is transforming healthcare in unprecedented ways. From diagnostic algorithms that detect diseases earlier than human doctors to personalized treatment plans based on individual genetic profiles, AI is at the forefront of medical innovation.</p>
      
      <p>One of the most promising applications is in predictive analytics. By analyzing vast amounts of patient data, AI systems can identify individuals at high risk of developing specific conditions, enabling preventive interventions before symptoms appear.</p>
      
      <p>Machine learning models are also enhancing medical imaging interpretation, flagging potential abnormalities that might be missed by human radiologists. This doesn't replace healthcare professionals but rather augments their capabilities, allowing them to focus on complex cases and patient care.</p>
      
      <p>Despite these advancements, challenges remain in areas such as data privacy, algorithmic bias, and integration with existing healthcare systems. Regulatory frameworks are still evolving to keep pace with these rapid technological developments.</p>
      
      <p>As we look to the future, the combination of AI with other emerging technologies like genomics and wearable health monitors promises to create a more proactive, precise, and personalized healthcare ecosystem.</p>
    `,
    source: {
      name: 'Medical Technology Today',
      url: 'https://example.com/medical-tech'
    },
    publishedAt: '2025-04-28T10:30:00Z',
    author: 'Dr. Emily Chen',
    category: 'technology',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1470&q=80',
    difficultyLevel: 'intermediate',
    readTime: 7,
    tags: ['artificial intelligence', 'healthcare', 'machine learning', 'medical innovation']
  },
  {
    id: '2',
    title: 'Climate Change: Latest Research Shows Accelerating Arctic Ice Melt',
    summary: 'New studies reveal Arctic ice is melting 25% faster than previous estimates, raising concerns about global sea levels.',
    content: `
      <p>Recent research from the International Polar Institute indicates that Arctic ice sheets are melting at a rate 25% faster than previous scientific models predicted. This accelerated melting has profound implications for global sea level rise and ocean circulation patterns.</p>
      
      <p>Scientists analyzing satellite data spanning the last decade have observed not only thinning ice but also structural changes that make remaining ice more susceptible to future melting. "What we're seeing is a feedback loop," explains Dr. Sarah Johnson, lead researcher on the study. "As ice melts, darker water absorbs more solar radiation, further warming the Arctic waters."</p>
      
      <p>The study employed advanced radar technology to measure ice thickness across the entire Arctic region, providing unprecedented detail about the changing landscape. These measurements were combined with climate models to project future scenarios.</p>
      
      <p>Under current trajectories, the Arctic could experience ice-free summers by 2035, approximately a decade earlier than previous estimates suggested. This timing has significant implications for wildlife habitats, indigenous communities, and global weather patterns.</p>
      
      <p>Policymakers are being urged to factor these accelerated timelines into climate adaptation strategies and emissions reduction targets to mitigate the most severe potential outcomes.</p>
    `,
    source: {
      name: 'Earth Science Journal',
      url: 'https://example.com/earth-science'
    },
    publishedAt: '2025-04-29T14:15:00Z',
    author: 'Prof. James Thompson',
    category: 'science',
    imageUrl: 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?auto=format&fit=crop&w=1469&q=80',
    difficultyLevel: 'advanced',
    readTime: 9,
    tags: ['climate change', 'arctic', 'global warming', 'sea level rise']
  },
  {
    id: '3',
    title: 'Understanding Basic Economic Principles for Everyday Financial Decisions',
    summary: 'Learn how fundamental economic concepts can help you make smarter decisions about saving, spending, and investing.',
    content: `
      <p>Economics isn't just for financial analysts and government policymakers—it's relevant to everyday decisions we all make. Understanding a few basic economic principles can dramatically improve your personal financial choices.</p>
      
      <p>The concept of opportunity cost is perhaps the most practical economic idea for daily life. Every time you spend money on one thing, you're choosing not to spend it on something else. Being mindful of these trade-offs helps prioritize what truly matters to you.</p>
      
      <p>Another useful principle is diminishing marginal utility—the idea that each additional unit of something provides less satisfaction than the one before it. This explains why the fifth cookie doesn't bring as much joy as the first, and can help curb excessive spending on things that won't actually increase your happiness.</p>
      
      <p>Understanding inflation is crucial for long-term planning. Money sitting in a standard savings account actually loses purchasing power over time if the interest rate is lower than inflation. This knowledge might encourage diversifying into other investment vehicles.</p>
      
      <p>Economic thinking also helps with budgeting by emphasizing the difference between fixed and variable costs, and how to plan around both types of expenses to maintain financial stability.</p>
    `,
    source: {
      name: 'Personal Finance Today',
      url: 'https://example.com/personal-finance'
    },
    publishedAt: '2025-04-27T09:00:00Z',
    author: 'Maria Rodriguez',
    category: 'business',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1472&q=80',
    difficultyLevel: 'beginner',
    readTime: 5,
    tags: ['economics', 'personal finance', 'budgeting', 'financial literacy']
  },
  {
    id: '4',
    title: 'New Exercise Guidelines Emphasize Quality Over Quantity',
    summary: 'Latest health research shows brief, intense workouts can be more beneficial than longer moderate sessions.',
    content: `
      <p>The National Health Institute has released updated physical activity guidelines that challenge conventional wisdom about exercise. According to the new recommendations, shorter, more intense workouts can provide equal or greater health benefits compared to longer, moderate sessions.</p>
      
      <p>"We used to think 30 continuous minutes was the gold standard," explains Dr. Robert Kim, who served on the guidelines committee. "Now we understand that three 10-minute sessions of higher intensity activity throughout the day might actually be more beneficial for many people."</p>
      
      <p>This shift is based on recent studies demonstrating that brief periods of vigorous activity—where conversation becomes difficult—trigger more significant metabolic changes and cellular adaptations than longer periods of light activity.</p>
      
      <p>The guidelines maintain that any physical activity is better than none, but they now offer more flexible approaches to accommodate busy lifestyles. For example, incorporating "exercise snacks"—very short bursts of activity like taking the stairs or doing a quick set of jumping jacks—throughout the day can significantly improve cardiovascular health over time.</p>
      
      <p>These findings are particularly encouraging for individuals who cite "lack of time" as their primary obstacle to regular exercise, as they validate that meaningful health benefits can be achieved in much shorter timeframes than previously thought.</p>
    `,
    source: {
      name: 'Wellness Science',
      url: 'https://example.com/wellness-science'
    },
    publishedAt: '2025-04-30T11:45:00Z',
    author: 'Dr. Marcus Allen',
    category: 'health',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1470&q=80',
    difficultyLevel: 'beginner',
    readTime: 6,
    tags: ['exercise', 'fitness', 'health guidelines', 'physical activity']
  },
  {
    id: '5',
    title: 'Global Trade Agreements Face Uncertainty as Economic Policies Shift',
    summary: 'Major economies are reevaluating trade partnerships amid changing political landscapes and economic priorities.',
    content: `
      <p>Global trade relationships are entering a period of significant flux as several major economies reconsider their international commerce strategies. Longstanding agreements that have defined cross-border trade for decades are being scrutinized under new economic and political pressures.</p>
      
      <p>The International Economic Forum's latest report indicates that 37% of existing trade agreements between G20 nations are currently under formal review or renegotiation—an unprecedented level in the post-World War II era. These reassessments are driven by multiple factors, including changing domestic priorities, evolving supply chain security concerns, and shifts in comparative economic advantages.</p>
      
      <p>"We're seeing a fundamental realignment of how nations view trade relationships," explains economist Sophia Nakamura. "The emphasis has shifted from pure economic efficiency toward concepts like resilience, sustainability, and strategic autonomy."</p>
      
      <p>Particular attention is being paid to high-tech industries, where intellectual property concerns and national security considerations are prompting more restrictive policies. Simultaneously, climate-related provisions are becoming standard features in new agreements, creating additional compliance complexities for businesses operating internationally.</p>
      
      <p>Analysts project this period of uncertainty could last 3-5 years before a new equilibrium emerges in global trade governance, with more regionalized frameworks potentially replacing some aspects of the multilateral system that has dominated for the past half-century.</p>
    `,
    source: {
      name: 'Global Economics Review',
      url: 'https://example.com/global-economics'
    },
    publishedAt: '2025-04-30T15:30:00Z',
    author: 'Jonathan Blackwell',
    category: 'politics',
    imageUrl: 'https://images.unsplash.com/photo-1607642382157-267e21899feb?auto=format&fit=crop&w=1470&q=80',
    difficultyLevel: 'advanced',
    readTime: 10,
    tags: ['global trade', 'economics', 'international relations', 'policy']
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    articleId: '1',
    questions: [
      {
        id: '1-1',
        question: 'Which field is AI primarily revolutionizing according to the article?',
        options: [
          'Entertainment',
          'Healthcare',
          'Agriculture',
          'Transportation'
        ],
        correctOptionIndex: 1,
        explanation: 'The article focuses specifically on AI applications in healthcare, such as predictive analytics and personalized treatment plans.'
      },
      {
        id: '1-2',
        question: 'What role does AI play in medical imaging according to the article?',
        options: [
          'It completely replaces radiologists',
          'It creates images from verbal descriptions',
          'It enhances interpretation by flagging potential abnormalities',
          'It speeds up image capturing time'
        ],
        correctOptionIndex: 2,
        explanation: 'The article mentions that machine learning models enhance medical imaging interpretation by flagging potential abnormalities, augmenting rather than replacing healthcare professionals.'
      },
      {
        id: '1-3',
        question: 'Which of these is mentioned as a challenge for AI in healthcare?',
        options: [
          'Excessive computing power requirements',
          'Patient resistance to AI technologies',
          'Data privacy concerns',
          'High failure rates of AI diagnoses'
        ],
        correctOptionIndex: 2,
        explanation: 'The article specifically mentions data privacy as one of the challenges facing AI implementation in healthcare systems.'
      }
    ]
  },
  {
    id: '2',
    articleId: '2',
    questions: [
      {
        id: '2-1',
        question: 'According to the research, Arctic ice is melting how much faster than previous estimates?',
        options: [
          '10%',
          '25%',
          '50%',
          '75%'
        ],
        correctOptionIndex: 1,
        explanation: 'The article states that Arctic ice sheets are melting at a rate 25% faster than previous scientific models predicted.'
      },
      {
        id: '2-2',
        question: 'What phenomenon creates a feedback loop in Arctic ice melting?',
        options: [
          'Greenhouse gas emissions from melting permafrost',
          'Darker water absorbing more solar radiation',
          'Changing ocean currents bringing warmer waters',
          'Increased precipitation in polar regions'
        ],
        correctOptionIndex: 1,
        explanation: 'The article explains that as ice melts, darker water absorbs more solar radiation, further warming the Arctic waters, creating a feedback loop.'
      },
      {
        id: '2-3',
        question: 'By what year could the Arctic experience ice-free summers according to the new projections?',
        options: [
          '2025',
          '2035',
          '2045',
          '2055'
        ],
        correctOptionIndex: 1,
        explanation: 'The article states that under current trajectories, the Arctic could experience ice-free summers by 2035, approximately a decade earlier than previous estimates.'
      }
    ]
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Complete your first article quiz',
    iconUrl: '🏆',
    criteria: 'Complete 1 quiz',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Knowledge Seeker',
    description: 'Read 10 articles',
    iconUrl: '📚',
    criteria: 'Read 10 articles',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Quiz Master',
    description: 'Score 100% on 5 quizzes',
    iconUrl: '🧠',
    criteria: 'Score 100% on 5 quizzes',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Well Rounded',
    description: 'Read articles from 5 different categories',
    iconUrl: '🌍',
    criteria: 'Read articles from 5 different categories',
    createdAt: '2025-01-01T00:00:00Z'
  }
];
