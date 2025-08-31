import React, { useState, useRef } from 'react';
import { Camera, Upload, Scan, Zap, Edit3, Check, X, AlertCircle, Sparkles, Brain, Target } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { AIFoodAnalysisService } from '../services/aiAnalysis';
import type { FoodAnalysis, DetectedFood } from '../types';

interface AIFoodAnalysisProps {
  onAnalysisComplete: (analysis: FoodAnalysis) => void;
  onClose: () => void;
}

export const AIFoodAnalysis: React.FC<AIFoodAnalysisProps> = ({ onAnalysisComplete, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [editingFood, setEditingFood] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiService = AIFoodAnalysisService.getInstance();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setIsAnalyzing(true);

    try {
      const result = await aiService.analyzeFoodImage(file);
      // Update the analysis with the correct image URL
      result.imageUrl = preview;
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateFoodQuantity = (foodIndex: number, newQuantity: number) => {
    if (!analysis) return;

    const updatedFoods = [...analysis.detectedFoods];
    updatedFoods[foodIndex] = {
      ...updatedFoods[foodIndex],
      quantity: Math.max(0.1, newQuantity)
    };

    const updatedAnalysis: FoodAnalysis = {
      ...analysis,
      detectedFoods: updatedFoods,
      isManuallyEdited: true
    };

    // Recalculate totals
    updatedAnalysis.totalCalories = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.calories * food.quantity), 0
    );
    updatedAnalysis.totalProtein = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.protein * food.quantity), 0
    );
    updatedAnalysis.totalCarbs = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.carbs * food.quantity), 0
    );
    updatedAnalysis.totalFat = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.fat * food.quantity), 0
    );

    setAnalysis(updatedAnalysis);
  };

  const removeFoodItem = (foodIndex: number) => {
    if (!analysis) return;

    const updatedFoods = analysis.detectedFoods.filter((_, index) => index !== foodIndex);
    const updatedAnalysis: FoodAnalysis = {
      ...analysis,
      detectedFoods: updatedFoods,
      isManuallyEdited: true
    };

    // Recalculate totals
    updatedAnalysis.totalCalories = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.calories * food.quantity), 0
    );
    updatedAnalysis.totalProtein = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.protein * food.quantity), 0
    );
    updatedAnalysis.totalCarbs = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.carbs * food.quantity), 0
    );
    updatedAnalysis.totalFat = updatedFoods.reduce(
      (sum, food) => sum + (food.nutrition.fat * food.quantity), 0
    );

    setAnalysis(updatedAnalysis);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end lg:items-center justify-center mobile-modal-overlay"
      onClick={onClose}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-3xl lg:rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto mobile-modal-content"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 lg:p-6">
          {/* Mobile drag handle */}
          <div className="lg:hidden absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
          
          <div className="flex items-center justify-between pt-4 lg:pt-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Food Analysis</h2>
              <p className="text-sm text-gray-600">Powered by computer vision</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors enhanced-touch-target"
          >
            <X className="w-6 h-6" />
          </button>
          </div>
        </div>

        <div className="p-6">
          {!imagePreview ? (
            /* Upload Interface */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze Your Food</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Upload a photo and our AI will automatically identify foods and calculate nutrition information
                </p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-3 p-6 border-2 border-dashed border-purple-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-purple-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Upload Photo</div>
                    <div className="text-sm text-gray-600">Choose from your device</div>
                  </div>
                </button>

                <button className="flex items-center justify-center space-x-3 p-6 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Take Photo</div>
                    <div className="text-sm text-gray-600">Use your camera</div>
                  </div>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tips for best results:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Ensure good lighting and clear view of food</li>
                      <li>• Include the entire plate or meal in frame</li>
                      <li>• Avoid shadows or reflections on the food</li>
                      <li>• Take photo from directly above when possible</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Food analysis"
                  className="w-full h-64 object-cover rounded-xl"
                />
                {analysis && analysis.detectedFoods.map((food, index) => (
                  food.boundingBox && (
                    <div
                      key={index}
                      className="absolute border-2 border-purple-500 bg-purple-500 bg-opacity-20 rounded"
                      style={{
                        left: `${(food.boundingBox.x / 400) * 100}%`,
                        top: `${(food.boundingBox.y / 300) * 100}%`,
                        width: `${(food.boundingBox.width / 400) * 100}%`,
                        height: `${(food.boundingBox.height / 300) * 100}%`
                      }}
                    >
                      <div className="absolute -top-6 left-0 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {food.name}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {isAnalyzing ? (
                <div className="text-center py-12">
                  <LoadingSpinner size="lg" />
                  <h3 className="text-lg font-semibold text-gray-900 mt-4">Analyzing your food...</h3>
                  <p className="text-gray-600">Our AI is identifying ingredients and calculating nutrition</p>
                  <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                    <div className="flex items-center space-x-2 text-purple-700 text-sm">
                      <Zap className="w-4 h-4" />
                      <span>Processing with advanced computer vision...</span>
                    </div>
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  {/* Analysis Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(analysis.confidence)}`}>
                              {Math.round(analysis.confidence * 100)}% confidence
                            </span>
                            <span className="text-gray-600">• {analysis.processingTime}ms</span>
                          </div>
                        </div>
                      </div>
                      {analysis.isManuallyEdited && (
                        <div className="flex items-center space-x-1 text-orange-600 text-sm">
                          <Edit3 className="w-4 h-4" />
                          <span>Edited</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{Math.round(analysis.totalCalories)}</div>
                        <div className="text-sm text-gray-600">Calories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{Math.round(analysis.totalProtein)}g</div>
                        <div className="text-sm text-gray-600">Protein</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{Math.round(analysis.totalCarbs)}g</div>
                        <div className="text-sm text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{Math.round(analysis.totalFat)}g</div>
                        <div className="text-sm text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>

                  {/* Detected Foods */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detected Foods</h3>
                    <div className="space-y-4">
                      {analysis.detectedFoods.map((food, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-gray-900">{food.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(food.confidence)}`}>
                                  {Math.round(food.confidence * 100)}%
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600">Calories:</span>
                                  <span className="font-medium text-purple-600 ml-1">
                                    {Math.round(food.nutrition.calories * food.quantity)}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Protein:</span>
                                  <span className="font-medium text-green-600 ml-1">
                                    {Math.round(food.nutrition.protein * food.quantity)}g
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Carbs:</span>
                                  <span className="font-medium text-blue-600 ml-1">
                                    {Math.round(food.nutrition.carbs * food.quantity)}g
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Fat:</span>
                                  <span className="font-medium text-orange-600 ml-1">
                                    {Math.round(food.nutrition.fat * food.quantity)}g
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">Quantity:</span>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateFoodQuantity(index, food.quantity - 0.1)}
                                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                      -
                                    </button>
                                    <span className="font-medium text-gray-900 min-w-[3rem] text-center">
                                      {food.quantity.toFixed(1)}x
                                    </span>
                                    <button
                                      onClick={() => updateFoodQuantity(index, food.quantity + 0.1)}
                                      className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {food.servingSize} serving
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => removeFoodItem(index)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        setImagePreview('');
                        setAnalysis(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Try Another Photo
                    </button>
                    <button
                      onClick={() => analysis && onAnalysisComplete(analysis)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Use This Analysis</span>
                    </button>
                  </div>

                  {/* Accuracy Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">AI Analysis Disclaimer</p>
                        <p>
                          This analysis is an estimate based on visual recognition. 
                          Please review and adjust quantities as needed for accuracy. 
                          Results may vary based on preparation methods and portion sizes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Failed</h3>
                  <p className="text-gray-600 mb-4">We couldn't analyze this image. Please try another photo.</p>
                  <button
                    onClick={() => {
                      setImagePreview('');
                      setAnalysis(null);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};