# scorer.py
import os
from typing import Optional,Tuple
import joblib
import numpy as np

class ModelScorer:
    def __init__(self, model_path: str = "/models/if_model.joblib"):
        self.model_path = os.environ.get("MODEL_PATH", model_path)
        self.model = None
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print(f"[scorer] loaded model from {self.model_path}")
            else:
                print(f"[scorer] no model file at {self.model_path}; running in stub mode")
        except Exception as e:
            print("[scorer] error loading model:", e)
            self.model = None

    def score(self, feature_vector) ->Tuple[Optional[float], Optional[int]]:
        # ...
        """
        Returns (score, pred). For IsolationForest:
         - decision_function: higher => more normal; lower (negative) => anomalous
         - predict: 1 => normal, -1 => anomaly
        If no model, returns (None, None) or a heuristic stub.
        """
        if self.model is None:
            # simple heuristic fallback: if total_disp very small and mean_speed near zero -> treat as normal (no anomaly)
            # return None to let caller use rules only
            return None, None
        try:
            X = np.array(feature_vector).reshape(1, -1)
            score = float(self.model.decision_function(X)[0])
            pred = int(self.model.predict(X)[0])
            return score, pred
        except Exception as e:
            print("[scorer] scoring error:", e)
            return None, None
