"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import "@/components/style.css";
import { callAPI } from "@/utils/api-caller";
import New from "@/components/result";


const questions = [
 {
   question: "Which of the below best describes your skin type?",
   options: [
    { label: 'Combination skin',more: 'The T-zone (forehead, nose, chin) is generally oily and cheeks are normal or dry.', value: 'Combination' },
    { label: 'Dry skin',more: 'Skin feels tight and dry all-year round and flaking or itching is common.', value: 'Dry' },
    { label: 'Oily skin',more: 'Excess oil all over the face, often causing a sheen, congestion, or blocked pores.', value: 'Oily' },
    { label: 'Normal skin',more: 'Overall balanced skin with a smooth texture. Mild oiliness, dryness or breakouts can appear occasionally.', value: 'Normal' },
    { label: 'Acne skin',more: '', value: 'Acne' },
    { label: 'Sensitive skin',more: '', value: 'Sensitive' },
  ],},

  {
    question: "What is your primary skin concern?",
    options: [
     { label: 'Anti-Aging', value: 'age' },
     { label: 'Calming', value: 'calm' },
     { label: 'Hydrating', value: 'hydrate' },
     { label: 'Dullness', value: 'dull' },
     { label: 'Pore Tightening', value: 'pore' },   
   ],},
   {
    question: "What is your secondary skin concern?",
    options: [
      { label: 'Anti-Aging', value: 'age' },
      { label: 'Calming', value: 'calm' },
      { label: 'Hydrating', value: 'hydrate' },
      { label: 'Dullness', value: 'dull' },
      { label: 'Pore Tightening', value: 'pore' },   
    ],},
   {
    question: "How many steps should your skincare routine be?",
    options: [
     { label: 'Less than 3', value: '3' },
     { label: '4', value: '4' },
     { label: '5', value: '5' },
   ],},
 
];
       
const QuizPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const router = useRouter();
  const [activeButton, setActiveButton] = useState();
  const [isVisible, setIsVisible] = useState(true);
  const [sun, setSun] = useState([]);
  const [clean, setClean] = useState([]);
  const [toner, setToner] = useState([]);
  const [serum, setSerum] = useState([]);
  const [cream, setCream] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);


  useEffect(() => {
    if (quizCompleted) {
      fetchAllData();
    }
  }, [quizCompleted]);
  

  const handleOptionClick = (option) => {
    const newAnswers = {...answers, [currentQuestionIndex]: option }; 
    setAnswers(newAnswers);
    setActiveButton(newAnswers[3]);
    if (currentQuestionIndex < questions.length-1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsVisible(false);
      setQuizCompleted(true);

      
      console.log(newAnswers);
      
    }
  };
  
 
  const handleButtonClick = () => {
    router.push('/experience');
  }
  const reTest = () => {
    window.location.reload();
  }
  const viewResult =()=>{
    const x = document.getElementById("result");
    if (x.style.display === "none") {
      x.style.display = "block";
    }  
  }
  
const fetchAllData = async () => {
  const skinType = answers[0]?.value || '';
  const primaryConcern = answers[1]?.value || '';
  const secondaryConcern = answers[2]?.value || '';
  console.log("Fetching data with", { skinType, primaryConcern, secondaryConcern });

  try {
    const sunData = await callAPI(`/products?populate[0]=image&filters[$and][0][category][name][$eq]=Suncream&filters[$and][1][skins][name][$eq]=${skinType}`, "GET");
    console.log("Sun data:", sunData);
    setSun(sunData.data.data);

    const cleanData = await callAPI(`/products?populate[0]=image&filters[$and][0][category][name][$eq]=Cleanser&filters[$and][1][skins][name][$eq]=${skinType}`, "GET");
    console.log("Clean data:", cleanData);
    setClean(cleanData.data.data);

    const tonerData = await callAPI(`/products?populate[0]=image&filters[$and][0][category][name][$eq]=Toner&filters[$and][1][funtions][name][$eq]=${secondaryConcern}`, "GET");
    console.log("Toner data:", tonerData);
    setToner(tonerData.data.data);

    const serumData = await callAPI(`/products?populate[0]=image&filters[$and][0][category][name][$eq]=Serum&filters[$and][1][funtions][name][$eq]=${primaryConcern}`, "GET");
    console.log("Serum data:", serumData);
    setSerum(serumData.data.data);

    const creamData = await callAPI(`/products?populate[0]=image&filters[$and][0][category][name][$eq]=Cream&filters[$and][1][skins][name][$eq]=${skinType}`, "GET");
    console.log("Cream data:", creamData);
    setCream(creamData.data.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  const renderSteps = (num) => {
    const arrays = [sun, clean,cream,toner, serum];
    return Array.from({ length: num }, (_, index) => (
      <div key={index} className="flex space-x-5 ">
        Step {index+1}
         {arrays[index] && arrays[index].map((value, i) => (
          <New
            id={value.id}
            key={i}
            productName={value.attributes.name}
            imageUrl={value.attributes.image.data[0].attributes.url}
            
          />
        ))}
      </div>
    ));
  }
 
 

  return (

    <div className="flex flex-col items-center w-full h-full bg-custom-beige-2">
      <div className="ml-auto">
        <button onClick={reTest} className="pr-5 pt-10">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-9">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>

        <button
          className="pr-10 pt-10"
          onClick={handleButtonClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

        </button>
      </div>
       <h1 className="text-2xl font-semibold text-custom-brown ">
         Question {currentQuestionIndex + 1} / {questions.length}
       </h1>
      <div className="w-full max-w-2xl p-4 mt-4">
       <div className="text-center mb-4">
       
         <h1 className="text-2xl font-semibold text-custom-brown pb-4">
         {questions[currentQuestionIndex].question}         </h1>
       
       <div className="grid grid-cols-1 gap-4">
        
          {questions[currentQuestionIndex].options.map((option, index) => (
            <button key={index} onClick={() => handleOptionClick(option)} 
              className={activeButton === option ? "mystyle" : "p-4 text-lg font-semi text-custom-brown border border-custom-brown hover:bg-custom-yellow hover:text-white focus:bg-custom-yellow "} >
              {option.label}
              <br />
              {option.more}
            </button>
            
          ))}
        </div>
        
        </div>

      </div>
      <button id='btn1' style={{ display: isVisible ? "none" : "block" }} onClick={viewResult} className='text-semi hover:underline	'>View Result</button>
      <div id='result' style={{ display: "none"}} className='bg-white text-center p-4 text-lg font-bold text-custom-brown pb-20'>
      <h2 className='pt-20'>You have a {answers[0]?.value} skin</h2>
        <h2>Your skin concern are {answers[1]?.label} and {answers[2]?.label}</h2>
        <h2 className='pt-20'>Here is your skincare routine with {answers[3]?.value} steps:</h2>
        <div className='pl-20 py-20 flex grid grid-flow-row auto-rows-max space-y-20 items-center'>
          {answers[3] && renderSteps(parseInt(answers[3].value))}
        </div>

      </div>
    </div>
    
  );
  
}
export default QuizPage;





