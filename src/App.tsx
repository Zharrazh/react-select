import React from 'react';
import './App.scss';
import {Multiselect} from "./utils/components/MultiselectWithTimer/Multiselect"


export const App:React.FC = () =>  {
  return (
      <div className={"App"}>
        <Multiselect options={
            [
                {title:"Lorem"},
                {title:"ipsum"},
                {title:"dolor"},
                {title:"sit"},
                {title:"amet"},
                {title:"consectetur"},
            ]}/>
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
