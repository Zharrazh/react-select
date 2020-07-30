import "./Multiselect.scss"
import cn from "classnames"

import React, {Component, createRef, FormEvent, FunctionComponent} from "react";
import ReactDOM from "react-dom";

export type Option = {
    readonly title: string
}

type MultiselectProps = {
    readonly options : Option[]
}
type MultiselectState ={
    isExpanded:boolean;
    selectedOptions: Option[];
    showedOptions: Option[];
    query: string;
    isFocused:boolean;
}
export class Multiselect extends Component<MultiselectProps,MultiselectState> {

    readonly textInputRef: React.RefObject<HTMLInputElement>;
    readonly multiselectRef: React.RefObject<Multiselect>;

    constructor(props:MultiselectProps) {
        super(props);
        this.state = {
            isExpanded: false,
            selectedOptions: [],
            showedOptions: props.options,
            query:"",
            isFocused:false
        }
        this.multiselectRef = createRef<Multiselect>()
        this.textInputRef = createRef<HTMLInputElement>()

    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, false)
    }

    componentWillUnmount() {
        document.removeEventListener('click',this.handleClickOutside, false)
    }

    handleClickOutside = (event:any) => {
        const domNode = ReactDOM.findDOMNode(this)
        if(!event.path.includes(domNode)){
            this.setState({isFocused:false,isExpanded:false})
        }
    }
    handleOnMultiselectClick = () => {
        this.setState({isFocused:true,isExpanded:!this.state.isExpanded})
        this.textInputRef.current!.focus()
    }
    handleChangeQuery = (event:FormEvent<HTMLInputElement>) =>{
        const query = event.currentTarget.value
        this.setState({query:query})
        this.setState({showedOptions:this.getShowedOptions(this.props.options,this.state.selectedOptions,query)})
    }
    handleDeleteAll = () =>{
        this.setState({selectedOptions:[]})
        this.setState({
            showedOptions:this.getShowedOptions(this.props.options,this.state.selectedOptions,this.state.query)
        })
    }
    handleToggleExpand = () =>{
        this.setState({isExpanded:!this.state.isExpanded})
    }
    getShowedOptions = (allOptions:Option[], selectedOption:Option[], query:string) =>{
        return allOptions.filter((o)=>{
            // отбор тех кто не выбран и тех у кого в title есть вхождение строки query
            return !selectedOption.includes(o) && o.title.indexOf(query)!==-1
        })
    }
    createOnDeleteClickSelectedItemCallback = (option:Option) =>{
        //фунция сделана для замыкания
        return ()=>{
            this.setState({
                selectedOptions:this.state.selectedOptions.filter(o=>o!==option)
            })
        }
    }
    createOnClickListItemCallback = (option:Option) =>{
        return () => {
            this.setState({selectedOptions:[...this.state.selectedOptions, option]})
        }
    }
    render() {
        return (
            <div className={"multiselect"} onClick={this.handleOnMultiselectClick} >
                <div className={cn("multiselect__select", {"focused":this.state.isFocused})}>
                    <div className="multiselect__select__input">
                        {this.state.selectedOptions.map(option => {
                            return (
                            <SelectedOptionItem option={option}
                                                onDeleteClick={this.createOnDeleteClickSelectedItemCallback(option)}
                            />)
                        })}
                        <input type="text"
                               placeholder={"Select..."}
                               onInput={this.handleChangeQuery}
                               ref={this.textInputRef}
                        />
                    </div>
                    <div className="multiselect__select__controls">
                        <DeleteAllBtn onClick={this.handleDeleteAll}/>
                        <div className="multiselect__select__controls__separator"/>
                        <ExpandListBtn onClick={this.handleToggleExpand}/>
                    </div>

                </div>
                {this.state.isExpanded && this.state.showedOptions.length!==0 && <div className="multiselect__list">
                    {this.state.showedOptions.map(opinion => {
                        return <OptionListItem option={opinion} onClick={this.createOnClickListItemCallback(opinion)} />
                    })}
                </div>}

            </div>
        )
    }
}
/*export const Multiselect : FunctionComponent<MultiselectProps> = props => {



    const [isExpanded, setExpanded] = useState<boolean>(false)
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([])
    const [query, setQuery] = useState<string>("")
    const [isFocused,setFocused] = useState<boolean>(false)
    const [checkOutsideClicks, setCheckOutsideClicks] = useState<boolean>(false)

    const inputText = useRef<HTMLInputElement>(null)

    //Ужасное колдунство
    const multiselectRef = useRef<HTMLDivElement>(null)
    const handleClickOutside = (e:any) =>{
        debugger
        if(!e.path.includes(multiselectRef.current)){
            if(isFocused) setFocused(false)
        }
    }
    document.addEventListener('click', handleClickOutside, false)

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
        if(!checkOutsideClicks) setCheckOutsideClicks(true)
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
}*/


//Это кнопочка удаления всех выбранных итемов
type DeleteAllBtnProps = {
    onClick:()=>void;
}
const DeleteAllBtn: FunctionComponent<DeleteAllBtnProps> = ({onClick}) => {
    return ( <div className={"deleteAllBtn"} onClick={onClick}>
        <i className="fas fa-times"/>
    </div> )
}


//Это кнопочка расширения селекта (может быть и не стоило выносить в отдельный элемент)
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


// Это элемент из выпадающего списка
type OptionListItemProps = {
    readonly option:Option;
    onClick:() => void;
}
const OptionListItem: FunctionComponent<OptionListItemProps> = ({option,onClick}) =>{
    return <div className={"optionListItem"} onClick={onClick}>
        <div className="optionListItem__title">{option.title}</div>
    </div>
}

//Это иконочка выбраного итема
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

