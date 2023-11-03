// validator
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }

    // checking for minimum length
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid && validatableInput.value.length > validatableInput.minLength;
    }

    // checking for maximum length
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid && validatableInput.value.length > validatableInput.maxLength;
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid && validatableInput.value >= validatableInput.min;
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid && validatableInput.value <= validatableInput.max;
    }


    return isValid;
}


// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn;
        },
    };
    return adjDescriptor;
}

// project list class 
class ProjectList{
    templatEelement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

    constructor(private type: 'active' | 'finished') {
        this.templatEelement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templatEelement.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${type}-projects`;

        this.attach()
        this.renderContent();
    }

    private renderContent(){
        const listId=`${this.type}-projects-list`;
        this.element.querySelector('ul')!.id=listId;
        this.element.querySelector('h2')!.textContent=this.type.toUpperCase() + 'PROJECTS';
    }

    private attach(){
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}

// Project input class
class ProjectInput {
    templatEelement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templatEelement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templatEelement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value
        const enteredDescription = this.descriptionInputElement.value
        const enteredPeople = this.peopleInputElement.value

        const titleValidate: Validatable =
            { value: enteredTitle, required: true }

        const descriptionValidate: Validatable =
            { value: enteredTitle, required: true, minLength: 5 }

        const peopleValidate: Validatable =
            { value: +enteredTitle, required: true, min: 1, max: 5 }

        if (
            !validate(titleValidate) ||
            !validate(descriptionValidate) ||
            !validate(peopleValidate)
        ) {
            alert('Invalid input, please try again');
            return;
        } else {
            return [enteredDescription, enteredTitle, +enteredPeople]
        }
    }

    private clearInput() {
        this.titleInputElement.value = ''
        this.descriptionInputElement.value = ''
        this.peopleInputElement.value = ''
    }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people)
            this.clearInput()
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');