Overview

The Sign Language Recognition System is a computer vision and machine learning based application that detects and interprets hand gestures used in sign language. The system captures hand movements through a webcam and translates them into readable text, helping bridge the communication gap between hearing-impaired individuals and others.

This project uses image processing and deep learning techniques to recognize hand gestures in real time.

Features
Real-time hand gesture detection using webcam
Recognition of sign language alphabets or gestures
Converts gestures into readable text output
User-friendly interface for easy interaction
Helps improve accessibility for the hearing and speech impaired
Technologies Used
Python
OpenCV
TensorFlow / Keras
NumPy
MediaPipe (for hand tracking)
Matplotlib
System Architecture
Input Layer
Captures live video from the webcam.
Preprocessing
Frame extraction
Hand detection
Image normalization
Feature Extraction
Detects hand landmarks using MediaPipe.
Model Prediction
A trained machine learning/deep learning model predicts the gesture.
Output Layer
Displays the recognized sign as text.
