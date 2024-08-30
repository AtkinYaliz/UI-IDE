# Concepts

[Linear Regression](http://www.stat.yale.edu/Courses/1997-98/101/linreg.htm)

---

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

1. __Supervised ML:__ Training data includes known labels.  
  1.1. __Regression:__ Label is a numeric value  
Use case: Mr Siegel sells biles. He wants to predict the number of bike rentals based on day, season and weather. Temperature is a _feature_. Number of bikes rented is a _label_. The goal is to create a ML model to predict how many bikes will be rented given that day's average temperature. As we feed the data of past rentals and the corresponding average temperature to our ML model, a _relationship_ starts to emerge. That is the ML model that we want to provide to Mr. Siegel.
Other examples: Spam detection in email or weather forecasting or housing pricing predictions based on location, number of rooms etc.  
  1.2. __Classification:__ Label is a categorization (or class). The aim is to obtain a category.  
Use case: Predict whether a patient is at-risk for diabetes based on clinical measurements. Characteristics are height, weight, blood pressure etc. The labels we need is yes/no, representing if the patient eventually developed diabetes or not. Our algorithm is going to learn from these past data points and provide us with predictions in the form of a probability between 0 and 1. Our data scientist who are building this model will determine a cut-off threshold value.
Other examples: Classifying someone is high or low risk of missing a loan repayment. User login is a legitimate.  
2. __Unsupervised ML:__ Training data is unlabeled.  
  2.1. __Clustering:__ Similar items are grouped together.  
Use case: Vehicles with similar emissions and fuel efficiency characteristics are separated into clusters.

---

# What is RAG? (Retrieval Augmented Generation) | [PART 1](https://www.youtube.com/watch?v=u47GtXwePms)

<b>RAG</b> is used for systems that leverage LLM experience on your <ins>own content</ins>.  
Use case: Patient chat bot and the content source is going to be the contect from your website, or pdf documents. You wan this to be the contect to answer the patient's questions. The patient asks, "how do P prepare for my knee surgery?", instead of just going to chatGPT and getting a generic answer, you'd like to provide an answer that's from your health system. Or, they are "do you have a parking?". 
The solution is like prompt before prompt. The full prompt that we will send to LLM will be our instructions plus something like "please use this content in order to answer the patient question" at the end. You create a big prompt and send that whole packate to the LLM, and LLM will give a response based on your content.
The last teick here is your website or your content is huge and it talks about all kinds of topics beyond parking and beyond knee surgery so you really want to somehow pull out only the parts of your content that are relevant to the patient's question so you take all your content and you break it into chunks or these systems will break it into chunks so chunk might be a paragraph of content or a p or a couple paragraphs a page something like that and then those chunks are sent to a LLM, could be the same one or a different one and they are turned into a vector and so each each paragraph or each chunk will have a vector which is just is just a series of numbers and that series of numbers you can think of it as the numeric representation of the essence of that paragraph and what's different about these numbers just they're not random numbers but paragraphs that talk about a similar topic have close by numbers they almost have the same vectors. You could think of that as the question vector and then what happens we do a mathematical comparison real quick between the vector of the question and then the vectors of your content and pick like the top five documents that are closest to this question so do you

---

## __Fine-tuning:
It's the process of taking a pre-trained model (eg. Llama, ChatGPT) as a base model and then training it for at least one model parameter (with <ins>new data</ins>). You're not teaching your LLM new information instead you're guiding it to restructure its existing knowledge in a way you're teaching the model how to behave or how to comminicate in a specific manner. Fine-tune models offer several benefits including improved user experience higher quality results with fewer hallucications and cost savings through shorter prompts excellent accuracy.  

Use case: Finance & Investment
__Sentiment Analysis:__ in language models is the is the process of determining whether someone's opinion expressed in a piece of text is negative positive or a neutral one.


