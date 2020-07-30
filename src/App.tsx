import React from 'react';
import './App.scss';
import {Multiselect} from "./utils/components/MultiselectWithTimer/Multiselect"


export const App:React.FC = () =>  {
    const options = [
        {id:0,title:"Lorem"},
        {id:1,title:"ipsum"},
        {id:2,title:"dolor"},
        {id:3,title:"sit"},
        {id:4,title:"amet"},
        {id:5,title:"consectetur"},
    ]
  return (
      <div className={"App"}>
        <Multiselect options={options}
                     defaultSelectedOptions={[options[1],options[2]]}
                     onChange={(selectedOption)=>{
                         console.log(selectedOption)
                     }}
        />
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate deleniti distinctio doloribus et
                fugiat ipsum itaque, maxime numquam veniam? Ad, consectetur deserunt impedit nisi odio odit vel. Fuga,
                ipsum.3</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate deleniti distinctio doloribus et
              fugiat ipsum itaque, maxime numquam veniam? Ad, consectetur deserunt impedit nisi odio odit vel. Fuga,
              ipsum.3</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At cupiditate deleniti distinctio doloribus et
              fugiat ipsum itaque, maxime numquam veniam? Ad, consectetur deserunt impedit nisi odio odit vel. Fuga,
              ipsum.3</p>
      </div>
  )
}
