import os
import random
import json

from flask import Flask
from flask import render_template
from flask import jsonify
from flask import request
from flask import send_file

# from PIL import Image
# import requests
#
import GetPixivImage

app = Flask(__name__)


@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404


def GetSlidesImage() -> list:
    # https://gitcode.net/qq_53280175/kuko/-/raw/master/static/index/PYDOME_TYPE/images/slides/{file}
    ImageList = []

    walkPath = "./static/base/images/slides/"
    for paths, dirs, files in os.walk(walkPath):
        for file in files:
            ImageList.append(paths+file)

    return ImageList

@app.context_processor
def context_processor():
    return dict(BgImageFile=GetSlidesImage())

@app.route("/", )
def index():
    return render_template(
        "index.html"
    )


@app.route("/LSP")
def LSP():
    return render_template("LSP.html")

@app.route("/resume",)
def resume():
    return render_template("resume.html")


@app.route("/love")
def PYahao():
    return render_template("love.html")


@app.route("/01_03")
def fun01_03():
    return render_template("01_03.html")


def GetAudio(_DIR):
    Audio = []

    for paths, dirs, files in os.walk(_DIR):
        for file in files:
            Audio.append(f"{paths}{file}")

    return Audio
    
@app.route("/deep_learning")
def deep_learning():
    return render_template("deep_learning.html")
    
@app.route("/deep_learning/getState", methods=['GET'])
def state_json():
    # 这个路由用于返回JSON文件
    # 假设你的JSON文件位于static/deep_learning/js/目录下
    return send_from_directory('static/deep_learning/js', 'state.json')


@app.route("/API/RandomAudio")
def ApiDls():
    role = int(request.args.get("role"))
    if role == 0:
        audio = random.choice(GetAudio("./static/hutao/audio/"))
    elif role == 1:
        audio = random.choice(GetAudio("static/dls/audio/"))
    else:
        return jsonify(
            {
                "code": 0,
                "audio": None,
                "illustrate": "?role=[角色数字] 0: 胡桃, 1: 德丽莎 "
            }
        )

    return jsonify(
        {
            "code": 1,
            "audio": "/"+audio
        }
    )



@app.get("/share")
def share():
    filename = request.args.get("filename")
    if filename is not None:
        iFpath = "static/share/"+filename

        if os.path.isfile(iFpath):
            return send_file(iFpath)
        else:
            return f"没有找到文件：{filename}"

    return """
        <h1 style="text-align: center;color: red;">
            参数错误
        </h1>
    """


@app.route("/API/PixivImage")
def PixivImage():
    return jsonify(
        {
            "url": GetPixivImage.GetImageUrl(
                random.choice(
                    GetPixivImage.GetRanking()
                )
            )
        }
    )


if __name__ == '__main__':
    app.run(
        host="0.0.0.0",
        port=12224,
        debug=True
    )
