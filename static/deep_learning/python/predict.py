import numpy as np
import torch
from sklearn.metrics import accuracy_score
from pathlib import Path
import os
import sys
import re
from static.deep_learning.python.classification.bert_fc.bert_fc_predictor import BertFCPredictor

def predict(pretrained_model_dir, model_dir, sentence="俄乌战争愈演愈烈，安理会上美国再次使用一票否决权，停战似乎遥遥无期！"):
    pattern = r'[\u4e00-\u9fff]|[a-zA-Z]+|\d+|[^ \t\n\r\f\v\u4e00-\u9fff\w]'
    line = sentence.strip()
    segments = re.findall(pattern, line)
    text=[]
    text.append(segments)
    print(text)
    current_dir = Path(__file__).parent
    pretrained_model_dir = current_dir / 'model' / pretrained_model_dir
    model_dir = current_dir / 'temp' / model_dir
    print(pretrained_model_dir)
    print(model_dir)
    predictor= BertFCPredictor(
        pretrained_model_dir=pretrained_model_dir,model_dir=model_dir
    )

    predict_labels,top_probs, top_labels = predictor.predict(text, batch_size=64)
    print(top_labels)
    return top_labels, top_probs

