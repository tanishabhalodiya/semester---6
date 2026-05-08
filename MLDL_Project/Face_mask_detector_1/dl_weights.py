import requests
print("Downloading weights...")
url = "https://github.com/opencv/opencv_3rdparty/raw/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel"
r = requests.get(url, allow_redirects=True)
with open('res10_300x300_ssd_iter_140000.caffemodel', 'wb') as f:
    f.write(r.content)
print("Done! Size:", len(r.content))
