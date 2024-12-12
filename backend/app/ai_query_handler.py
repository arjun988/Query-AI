import google.generativeai as genai
import os
import json
import regex as re
class AIQueryHandler:
    def __init__(self):
        """
        Initialize Gemini AI for query processing
        """
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        self.model = genai.GenerativeModel('gemini-pro')
    
    def optimize_query(self, original_query, db_type):
        """
        Use AI to optimize and enhance query
        
        Args:
            original_query (str): Original query
            db_type (str): Database type
        
        Returns:
            dict: Optimized query details
        """
        try:
            # Prepare prompt for AI query optimization
            prompt = f"""
            You are an expert database query optimizer. 
            Analyze the following {db_type.upper()} query and provide:
            1. Optimized query syntax
            2. Potential performance improvements
            3. Brief explanation of changes

            Original Query: {original_query}
            """
            
            # Generate AI response
            response = self.model.generate_content(prompt)
            
            # Parse and structure AI response
            optimization_details = {
                'original_query': original_query,
                'optimized_query': self._extract_query(response.text),
                'explanation': self._extract_explanation(response.text)
            }
            
            return optimization_details
        
        except Exception as e:
            print(f"AI Query Optimization Error: {str(e)}")
            return {
                'original_query': original_query,
                'optimized_query': original_query,
                'explanation': 'No optimization suggested'
            }
    
    def _extract_query(self, response):
        """
        Extract optimized query from AI response
        
        Args:
            response (str): Full AI response text
        
        Returns:
            str: Extracted query
        """
        # Use regex or parsing to extract query
        query_match = re.search(r'Optimized Query:?\n(.*?)(\n\n|$)', response, re.DOTALL)
        return query_match.group(1).strip() if query_match else response
    
    def _extract_explanation(self, response):
        """
        Extract explanation from AI response
        
        Args:
            response (str): Full AI response text
        
        Returns:
            str: Extracted explanation
        """
        explanation_match = re.search(r'Explanation:?\n(.*?)(\n\n|$)', response, re.DOTALL)
        return explanation_match.group(1).strip() if explanation_match else 'No detailed explanation'