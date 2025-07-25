// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const url = new URL(request.url);
        const query = url.searchParams.get('query');
        const category = url.searchParams.get('category');
        const framework = url.searchParams.get('framework');
        const pricing = url.searchParams.get('pricing');
        const difficulty = url.searchParams.get('difficulty');
        
        // Define all templates
        const allTemplates = [
            { id: 'template_1',
                name: 'React Dashboard',
                description: 'Modern dashboard template with React',
                category: 'dashboard',
                framework: 'react',
                pricing: 'free',
                difficulty: 'medium',
                downloads: 1250,
                rating: 4.8
            },
            { id: 'template_2',
                name: 'Next.js Blog',
                description: 'Blog template built with Next.js',
                category: 'blog',
                framework: 'nextjs',
                pricing: 'premium',
                difficulty: 'easy',
                downloads: 890,
                rating: 4.6
            },
            { id: 'template_3',
                name: 'Vue.js E-commerce',
                description: 'E-commerce template with Vue.js',
                category: 'ecommerce',
                framework: 'vue',
                pricing: 'premium',
                difficulty: 'hard',
                downloads: 567,
                rating: 4.9
            }
        ];
        
        let templates = allTemplates;
        
        // Apply search query
        if (query) {
            templates = templates.filter(template =>
                template.name.toLowerCase().includes(query.toLowerCase()) ||
                template.description.toLowerCase().includes(query.toLowerCase())
            )
}
        
        // Apply filters
        if (category) {
            templates = templates.filter(t => t.category === category)
}
        if (framework) {
            templates = templates.filter(t => t.framework === framework)
}
        if (pricing) {
            templates = templates.filter(t => t.pricing === pricing)
}
        if (difficulty) {
            templates = templates.filter(t => t.difficulty === difficulty)
}
        
        return NextResponse.json({ success: true,
            templates,
            total: templates.length,
            filters: { query, category, framework, pricing, difficulty }    })
} catch (error) {
        console.error('Templates API error:', error);
        return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500   
    })
}
}