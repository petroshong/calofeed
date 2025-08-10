import type { FoodAnalysis, DetectedFood } from '../types';

// AI Food Analysis Service
export class AIFoodAnalysisService {
  private static instance: AIFoodAnalysisService;
  private apiKey: string = '';
  private baseUrl: string = 'https://api.foodvisor.io/v2';

  private constructor() {}

  public static getInstance(): AIFoodAnalysisService {
    if (!AIFoodAnalysisService.instance) {
      AIFoodAnalysisService.instance = new AIFoodAnalysisService();
    }
    return AIFoodAnalysisService.instance;
  }

  // Mock AI analysis for demo purposes
  public async analyzeFoodImage(imageFile: File): Promise<FoodAnalysis> {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock analysis results
    const mockAnalysis: FoodAnalysis = {
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(imageFile),
      detectedFoods: [
        {
          name: 'Grilled Chicken Breast',
          confidence: 0.92,
          boundingBox: { x: 120, y: 80, width: 200, height: 150 },
          nutrition: { calories: 231, protein: 43.5, carbs: 0, fat: 5.0 },
          servingSize: '100g',
          quantity: 1.5
        },
        {
          name: 'Brown Rice',
          confidence: 0.87,
          boundingBox: { x: 50, y: 200, width: 150, height: 100 },
          nutrition: { calories: 112, protein: 2.6, carbs: 22, fat: 0.9 },
          servingSize: '100g',
          quantity: 0.8
        },
        {
          name: 'Steamed Broccoli',
          confidence: 0.94,
          boundingBox: { x: 300, y: 150, width: 120, height: 120 },
          nutrition: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
          servingSize: '100g',
          quantity: 1.2
        }
      ],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      confidence: 0.91,
      processingTime: 1847,
      timestamp: new Date().toISOString(),
      isManuallyEdited: false
    };

    // Calculate totals
    mockAnalysis.totalCalories = mockAnalysis.detectedFoods.reduce(
      (sum, food) => sum + (food.nutrition.calories * food.quantity), 0
    );
    mockAnalysis.totalProtein = mockAnalysis.detectedFoods.reduce(
      (sum, food) => sum + (food.nutrition.protein * food.quantity), 0
    );
    mockAnalysis.totalCarbs = mockAnalysis.detectedFoods.reduce(
      (sum, food) => sum + (food.nutrition.carbs * food.quantity), 0
    );
    mockAnalysis.totalFat = mockAnalysis.detectedFoods.reduce(
      (sum, food) => sum + (food.nutrition.fat * food.quantity), 0
    );

    return mockAnalysis;
  }

  public async analyzeImageFromUrl(imageUrl: string): Promise<FoodAnalysis> {
    // Mock analysis for URL-based images
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      id: Date.now().toString(),
      imageUrl,
      detectedFoods: [
        {
          name: 'Mixed Salad',
          confidence: 0.89,
          nutrition: { calories: 150, protein: 8, carbs: 12, fat: 9 },
          servingSize: '200g',
          quantity: 1
        }
      ],
      totalCalories: 150,
      totalProtein: 8,
      totalCarbs: 12,
      totalFat: 9,
      confidence: 0.89,
      processingTime: 1234,
      timestamp: new Date().toISOString(),
      isManuallyEdited: false
    };
  }

  public validateAnalysis(analysis: FoodAnalysis): boolean {
    return analysis.confidence > 0.7 && analysis.detectedFoods.length > 0;
  }
}