'use client';

type NameSuggestion = {
  name: string;
  reasoning: string;
};

type NameAnalysis = {
  strengths: string[];
  weaknesses: string[];
};

type NameSuggestionsProps = {
  currentNameAnalysis: NameAnalysis;
  suggestions: NameSuggestion[];
};

export default function NameSuggestions({
  currentNameAnalysis,
  suggestions,
}: NameSuggestionsProps) {
  return (
    <div className="space-y-8">
      {/* Current Name Analysis */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-4 text-xl font-semibold">تحلیل نام فعلی</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-lg font-medium text-green-600">نقاط قوت</h4>
            <ul className="list-inside list-disc space-y-1">
              {currentNameAnalysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-700">
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 text-lg font-medium text-red-600">نقاط ضعف</h4>
            <ul className="list-inside list-disc space-y-1">
              {currentNameAnalysis.weaknesses.map((weakness, index) => (
                <li key={index} className="text-gray-700">
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Name Suggestions */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">نام‌های پیشنهادی</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
            >
              <h4 className="mb-2 text-lg font-medium text-blue-600">
                {suggestion.name}
              </h4>
              <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
