class CalcController{
    constructor(){
        this._audio = new Audio('click.mp3');
        this._audioOnOFF = false;
        this._lastOperator = '';
        this._lasNumber = '';
        this._operation = [];
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.currentDate; 
        this.initialize();
        this.initButtonsEvents();
        this.iniKeyBoard();

    }
    //metodo da data e hora
    initialize(){
        
       this.setDisplayDateTime();
       
      setInterval(()=>{
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberDisplay();
        this.pasteFromClipBoard();


        document.querySelectorAll('btn-ac').forEach(btn=>{
            
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();
                
            });
            
        });
    }

    toggleAudio(){
           
        this._audioOnOFF = !this._audioOnOFF;

    }

    playAudio(){
        
        if(this._audioOnOFF){

             this._audio.currentTime = 0;
             this._audio.play();
        }
    }

    copyToClipBoard(){
        let input =  document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();

        document.execCommand("Copy");
        input.remove();

    }

    pasteFromClipBoard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        })
    }

    iniKeyBoard(){

           document.addEventListener('keyup', e=>{
               switch (e.key){
                case "Escape":
                    this.clearAll();
                    break;
                case "Backspace":
                    this.clearEntry();
                    break;
                case "+":
                case "-":
                case "*":
                case "/":
                case "porcento":
                this.addOperation(e.key);
                break;


                case "Enter":
                case "=":
                this.calc();
                break;
                case ".":
                case ",":
                this.addDot();
                break;
     
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key));
                    break; 
                case "c":
                    if(e.ctrlKey) this.copyToClipBoard();
                    break; 
            }

           });
    }

    addEventListenerAll(element, events, fn){
        
        events.split(" ").forEach(event =>{
            element.addEventListener(event,fn, false);
        })
    }
    clearAll(){
        this._operation = [0];
        this.setLastNumberDisplay();
        this._lastNumber = '';
        this._lastOperator = '';
        
    }
 
    clearEntry(){
        this._operation.pop();
        this.setLastNumberDisplay();
    }
 
    getLastOperation(){
        return this._operation[this._operation.length-1];
    }
 
    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }
    isOperator(value){
        return (["+", "-", "/", "*", "%"].indexOf(value) > -1); 
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();
        }
    }

    getResult(){
       
        try {
            
            return eval(this._operation.join(""));
    
        } catch (error) {
            setTimeout(()=>{
                    
                this.setError()
            },1)         
        }
    }
        

    calc(){

        let last = '';
        
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firsItem = this._operation[0];
            this._operation = [firsItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            
            this._lastNumber = this.getResult();

        }else if (this._operation.length == 3) {
            
            
            this._lastNumber = this.getLastItem(false);
        }

        //console.log('operator', this._lastOperator);
        //console.log('number', this._lastNumber);
        
        
        
        let result = this.getResult();

        if (last == '%') {
            
          result /=  100;

          this._operation = [result];   

        }else{

            this._operation = [result];
            if (last) this._operation.push(last);   
        
        }

        this.setLastNumberDisplay();
    }

    getLastItem(isOperator = true){
        let lastItem;
        for (let i = this._operation.length-1; i >= 0; i--) {

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
                }
            
        }

        if (!lastItem) {
            
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        } 

        return lastItem;
    }
    

    setLastNumberDisplay(){
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) {
            lastNumber = 0;
            }

        this.displayCalc = lastNumber;
    }

 
    addOperation(value){
 
        //console.log("A", value, isNaN(this.getLastOperation()));
        
        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){
                
                this.setLastOperation(value);
            }else{

                this.pushOperation(value);

                 //atualizar display
                 this.setLastNumberDisplay();
            }
 
        }else{

            if(this.isOperator(value)){

                this.pushOperation(value);

            }else{

                let newValue = this.getLastOperation().toString() + value.toString();
                
                this.setLastOperation(newValue);


                //atualizar display
                this.setLastNumberDisplay();
            }
        }
    
        //console.log(this._operation);
    }
 
    setError(){
        this.displayCalc = "Error";
    }

    addDot(){

       let lastOperation = this.getLastOperation();
       //console.log(lastOperation);

       if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;


       if (this.isOperator(lastOperation) || !lastOperation) {
           
        this.pushOperation('0.');

       }else{


           this.setLastOperation(lastOperation.toString() + '.');

           this.setLastNumberDisplay();

       }
       

    }
 
    exercBtn(value){
        this._audio.play();
        switch (value){
            case "ac":
                this.clearAll();
                break;
            case "ce":
                this.clearEntry();
                break;
            case "soma":
                this.addOperation("+");
                break;
            case "subtracao":
                this.addOperation("-");
                break;
            case "divisao":
                this.addOperation("/");
                break;
            case "multiplicacao":
                this.addOperation("*");
                break;
            case "porcento":
                this.addOperation("%");
                break;
            case "igual":
                this.calc();
                break;
            case "ponto":
                this.addDot(".");
                break;
 
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }
    initButtonsEvents(){
        
        
        let buttons = document.querySelectorAll("#buttons > g, #parts > g ");
       
        buttons.forEach((btn, index) =>{
            
            this.addEventListenerAll(btn, "click drag", e=>{
            this.exercBtn(btn.className.baseVal.replace("btn-",""));
            });
 
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{
                //pointer é o curso com a mão apontando
                btn.style.cursor = "pointer";
            });
        });
 
    }
 
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day : "2-digit",
            month : "long",
            year : "numeric"            

        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
 
    get displayTime(){
        return this._timeEl.innerHTML;
    }
 
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }
    get displayDate(){
        return this._dateEl.innerHTML;
    }
    set displayDate(value){
        this._dateEl.innerHTML = value;
    }
 
    get displayCalc(){
    
        return this._displayCalcEl.innerHTML;
    }
 
    set displayCalc(value){

        if(value.toString().length > 10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value; 
    }
    
    get currentDate(){
        return new Date();
    }
 
    set currentDate(value){
        this.currentDate = value;
    }
}
