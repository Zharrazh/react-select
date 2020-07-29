import "./Multiselect.scss"
import cn from "classnames"

import React, {ChangeEvent, FunctionComponent, useRef, useState} from "react";
import useOnClickOutside from 'use-onclickoutside'

export type Option = {
    readonly title: string
}
type MultiselectProps = {
    readonly options : Option[]
}


export const Multiselect : FunctionComponent<MultiselectProps> = props => {

    const multiselectRef = useRef<HTMLDivElement>(null)
    const inputText = useRef<HTMLInputElement>(null)

    const [isExpanded, setExpanded] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
    const [query, setQuery] = useState<string>("")
    const [isFocused,setFocused] = useState<boolean>(false)
    useOnClickOutside(multiselectRef, ()=>{
        if(isFocused) setFocused(false)
        if(isExpanded) setExpanded(false)
    })


    const unselectedOptions = props.options.filter(option =>{
        return (!selectedOptions.includes(option))
    })
    let showedOptions: Option[]
    if(query===""){
        showedOptions=unselectedOptions;
    }
    else{
        showedOptions=unselectedOptions.filter(o=>{
            return o.title.indexOf(query)!==-1
        })
    }


    const createOnClickListItemCallback = (option:Option) => () =>{
        setSelectedOptions([...selectedOptions, option])
        inputText.current!.focus()
    }
    const createOnDeleteClickSelectedItemCallback = (option:Option) => () =>{
        setSelectedOptions(selectedOptions.filter(o=>o!==option))
        inputText.current!.focus()
    }

    const handleDeleteAll = () => {
        setSelectedOptions([])
        inputText.current!.focus()
    }
    const handleToggleExpand= () => {
        setExpanded(!isExpanded)
        inputText.current!.focus()
    }
    const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.currentTarget.value)
        if(!isExpanded) setExpanded(true)
    }

    const handleOnMultiselectClick = () => {
        if(!isFocused) setFocused(true)
    }

    const handleInputClick = () => {
        setExpanded(!isExpanded)
    }

    return (
        <div className={"multiselect"} onClick={handleOnMultiselectClick} ref={multiselectRef}>
            <div className={cn("multiselect__select", {"focused":isFocused})}>
                <div className="multiselect__select__input">
                    {selectedOptions.map(option => {
                        return <SelectedOptionItem option={option} onDeleteClick={createOnDeleteClickSelectedItemCallback(option)}/>
                    })}
                    <input type="text" placeholder={"Select..."} onInput={handleChangeQuery} onClick={handleInputClick} ref={inputText} />
                </div>
                <div className="multiselect__select__controls">
                    <DeleteAllBtn onClick={handleDeleteAll}/>
                    <div className="multiselect__select__controls__separator"/>
                    <ExpandListBtn onClick={handleToggleExpand}/>
                </div>

            </div>
            {isExpanded && showedOptions.length!==0 && <div className="multiselect__list">
                {showedOptions.map(opinion => {
                    return <OptionListItem option={opinion} onClick={createOnClickListItemCallback(opinion)} />
                })}
            </div>}

        </div>
    )
}

type DeleteAllBtnProps = {
    onClick:()=>void;
}
const DeleteAllBtn: FunctionComponent<DeleteAllBtnProps> = ({onClick}) => {
    return ( <div className={"deleteAllBtn"} onClick={onClick}>
        <i className="fas fa-times"/>
    </div> )
}

type ExpandListBtnProps = {
    onClick:()=>void;
}
const ExpandListBtn: FunctionComponent<ExpandListBtnProps> = ({onClick}) => {
    return(
        <div className={"expandListBtn"} onClick={onClick}>
            <i className="fas fa-angle-down"/>
        </div>
    )
}

type OptionListItemProps = {
    readonly option:Option;
    onClick:() => void;
}
const OptionListItem: FunctionComponent<OptionListItemProps> = ({option,onClick}) =>{
    return <div className={"optionListItem"} onClick={onClick}>
        <div className="optionListItem__title">{option.title}</div>
    </div>
}

type SelectedOptionItemProps = {
    option: Option;
    onDeleteClick: () => void;
}
const SelectedOptionItem : FunctionComponent<SelectedOptionItemProps> = ({option,onDeleteClick}) => {
    return <div className={"selectedOptionItem"}>
        <div className="selectedOptionItem__title">{option.title}</div>
        <div className="selectedOptionItem__deleteBtn" onClick={onDeleteClick}>
            <i className="fas fa-times"/>
        </div>
    </div>
}

