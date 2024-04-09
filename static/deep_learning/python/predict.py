import numpy as np
import torch
from sklearn.metrics import accuracy_score
from pathlib import Path
import os
import sys


from static.deep_learning.python.classification.bert_fc.bert_fc_predictor import BertFCPredictor

def predict(sentence="俄乌战争愈演愈烈，安理会上美国再次使用一票否决权，停战似乎遥遥无期！"):
    title=[]
    line = sentence.strip()
    
    line = line.split(' ')

    title.append(list(line))
    print(title)

    
    current_dir = Path(__file__).parent
    pretrained_model_dir = current_dir / 'model' / 'bert-base-chinese'
    model_dir = current_dir / 'temp' / 'bertfc'
    predictor= BertFCPredictor(
        pretrained_model_dir=pretrained_model_dir,model_dir=model_dir
    )

    predict_labels,top_probs, top_labels = predictor.predict(title, batch_size=64)
    
    return top_labels, top_probs

