import re
from enum import Enum
from typing import Tuple, Dict

class RiskLevel(str, Enum):
    LOW = "Low"             # General information (e.g., "benefits of yoga")
    MODERATE = "Moderate"   # Symptom checking / medical questions (e.g., "fever remedies")
    HIGH = "High"           # Emergency / Critical (e.g., "heart attack symptoms")

# Emergency keywords trigger immediate refusal/alert
EMERGENCY_KEYWORDS = [
    "suicide", "kill myself", "want to die", "overdose", 
    "heart attack", "stroke", "difficulty breathing", "severe bleeding",
    "poison", "unconscious", "call 911", "chest pain", "crushing pain",
    "seizure", "anaphylaxis", "severe burn"
]

# Diagnostic intents for Moderate risk detection
DIAGNOSTIC_KEYWORDS = [
    "symptom", "diagnosis", "do i have", "treatment", "cure", 
    "medicine", "pills", "therapy", "pain", "hurt", "swollen", 
    "rash", "fever", "infection"
]

DISCLAIMERS = {
    RiskLevel.LOW: "This information is for educational purposes only.",
    RiskLevel.MODERATE: "This information is not medical advice. Consult a healthcare professional for diagnosis.",
    RiskLevel.HIGH: "⚠️ EMERGENCY PROTOCOL: This query indicates a potential medical emergency."
}

class SafetyGuard:
    @staticmethod
    def classify_risk(query: str) -> Tuple[RiskLevel, str]:
        """
        Classifies the query risk level and returns the appropriate disclaimer/warning.
        """
        query_lower = query.lower()
        
        # 1. Check HIGH Risk (Emergency)
        for kw in EMERGENCY_KEYWORDS:
            if kw in query_lower:
                return RiskLevel.HIGH, DISCLAIMERS[RiskLevel.HIGH]
        
        # 2. Check MODERATE Risk (Diagnostic/Treatment)
        for kw in DIAGNOSTIC_KEYWORDS:
            if kw in query_lower:
                return RiskLevel.MODERATE, DISCLAIMERS[RiskLevel.MODERATE]
                
        # 3. Default to LOW Risk
        return RiskLevel.LOW, DISCLAIMERS[RiskLevel.LOW]

    @staticmethod
    def is_emergency(query: str) -> bool:
        """Legacy check, mapped to classify_risk."""
        risk, _ = SafetyGuard.classify_risk(query)
        return risk == RiskLevel.HIGH

