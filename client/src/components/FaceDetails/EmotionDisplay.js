import React from 'react';
import Emotion from './Emotion'

import anger from './images/anger.png'
import disgust from './images/disgust.png'
import fear from './images/fear.png'
import happiness from './images/happiness.png'
import neutral from './images/neutral.png'
import sadness from './images/sadness.png'
import surprise from './images/surprise.png'

function EmotionDisplay(props) {
    
    let emotionArray = [props.emotions.anger, props.emotions.contempt+props.emotions.disgust, props.emotions.fear,
        props.emotions.happiness, props.emotions.neutral, props.emotions.sadness, props.emotions.surprise]
    let totalEmotion = 0;

    for (let i = 0; i < emotionArray.length; i++){
        totalEmotion += emotionArray[i];
    }

    let emotionPercentages = emotionArray.map(num => Math.round((num/totalEmotion)*100))

    let emojis = [anger, disgust, fear, happiness, neutral, sadness, surprise]

    let objects = [];

    for(let i = 0; i < emotionArray.length; i++){
        let replace = {emotion: emojis[i], 
            percentage: emotionPercentages[i]};
        objects.push(replace) 
    }
 
    objects.sort((a, b) => {
        return a.percentage - b.percentage
    })

    objects.reverse()
    const emotionComponents = [];

    for (let i = 0; i < emotionArray.length; i++){
        if(objects[i].percentage > 0){
            emotionComponents.push(<Emotion key={i} img={objects[i].emotion} percentage={objects[i].percentage}/>)
        }
    }

    
    return (
    <div className="emotionDisplay">
        {emotionComponents}  
    </div>
    );
}

export default EmotionDisplay;
