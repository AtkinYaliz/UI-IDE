# AI-900: Microsoft Azure AI Fundamentals Virtual Training day | [PART 1](https://www.youtube.com/watch?v=u1TdqIZKuTU)

## What is AI?

### Software that imitates human capabilities
-	Predicting outcomes and recognising patterns based on historic data
-	Recognising abnormal events and making decisions
-	Interpret visual input
-	Understanding language and engaging in conversation
- Extract information from sources to gain knowledge 

### Common AI Workloads:

- **Machine Learning (ML):** Our aim is to create predictive models based on data and statistics - the foundation for AI
- **Anomaly Detection:** Systems that detect unusual patterns or events, enabling pre-emptive action
- **Computer Vision:** Applications that interpret visual input from cameras, images, or videos
- **Natural Language Processing (NLP):** Applications that can interpret written or spoken language, and engage in dialogs with human users
- **Knowledge Mining:** Extract information from data sources to create a searcable knowledge store

### What is Machine Learning?
Think about traditional programming. The idea in a traditional programming model is the programmer thinks about what this program has to do and they have to provide the code or the instruction or an algorithm to teach to computer how to execute a task. And, any input we provide is subsequently go through the algorithm designed by the programmer and the output is going to come out.  
Machine learning however, is creating a predictive model by finding relationships in data. We are providing data, which is both the input and the output to the computer and letting the computer think for itself and come up with the algorithm. This algorithm is not done by the computer. That is the ML model.  
We use data to train a ML model to power an AI-based software, to carry out the jobs of the future.  

*Feature (parameter):* The characteristics of the data   
*Label:*  The outcome

1. Supervised ML: Training data includes known labels.  
  1.1. Regression: Label is a numeric value  
Case study: Mr Siegel sells biles. He wants to predict the number of bike rentals based on day, season and weather. Temperature is a _feature_. Number of bikes rented is a _label_. The goal is to create a ML model to predict how many bikes will be rented given that day's average temperature. As we feed the data of past rentals and the corresponding average temperature to our ML model, a _relationship_ starts to emerge. That is the ML model that we want to provide to Mr. Siegel.
Other examples: Spam detection in email or weather forecasting or housing pricing predictions based on location, number of rooms etc.  
  1.2. Classification: Label is a categorization (or class). The aim is to obtain a category.  
Case study: Predict whether a patient is at-risk for diabetes based on clinical measurements. Characteristics are height, weight, blood pressure etc. The labels we need is yes/no, representing if the patient eventually developed diabetes or not. Our algorithm is going to learn from these past data points and provide us with predictions in the form of a probability between 0 and 1. Our data scientist who are building this model will determine a cut-off threshold value.
Other examples: Classifying someone is high or low risk of missing a loan repayment. User login is a legitimate.  
3. Unsupervised ML: Training data is unlabeled.
  3.1. Clustering: Similar items are grouped together.  
Case study: Vehicles with similar emissions and fuel efficiency characteristics are separated into clusters.
