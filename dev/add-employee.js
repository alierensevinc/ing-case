import {css, html, LitElement} from 'lit';

export class AddEmployee extends LitElement {
    static properties = {
        newEmployee: {type: Object},
        isEditing: {type: Boolean},
        editingEmployeeId: {type: Number}
    };

    static styles = css`
        :host {
            display: block;
            padding: 1rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .add-form {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .add-form input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #3b82f6;
            color: white;
        }
    `;

    constructor() {
        super();
        this.newEmployee = {
            firstName: '',
            lastName: '',
            dateOfEmployment: '',
            dateOfBirth: '',
            phoneNumber: '',
            email: '',
            department: '',
            position: ''
        };
        this.isEditing = false;
        this.editingEmployeeId = null;
    }

    handleInputChange(e) {
        const {name, value} = e.target;
        this.newEmployee = {...this.newEmployee, [name]: value};
    }

    handleAddEmployee() {
        const event = new CustomEvent('add-employee', {
            detail: {employee: this.newEmployee, isEditing: this.isEditing, editingEmployeeId: this.editingEmployeeId},
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
        window.location.href = '../index.html';
    }

    render() {
        return html`
            <div class="add-form">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="First Name" .value=${this.newEmployee.firstName}
                       @input=${this.handleInputChange}/>
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Last Name" .value=${this.newEmployee.lastName}
                       @input=${this.handleInputChange}/>
                <label for="dateOfEmployment">Date of Employment</label>
                <input type="date" id="dateOfEmployment" name="dateOfEmployment" placeholder="Date of Employment"
                       .value=${this.newEmployee.dateOfEmployment} @input=${this.handleInputChange}/>
                <label for="dateOfBirth">Date of Birth</label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" placeholder="Date of Birth" .value=${this.newEmployee.dateOfBirth}
                       @input=${this.handleInputChange}/>
                <label for="phoneNumber">Phone Number</label>
                <input type="text" id="phoneNumber" name="phoneNumber" placeholder="Phone Number" .value=${this.newEmployee.phoneNumber}
                       @input=${this.handleInputChange}/>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" .value=${this.newEmployee.email}
                       @input=${this.handleInputChange}/>
                <label for="department">Department</label>
                <input type="text" id="department" name="department" placeholder="Department" .value=${this.newEmployee.department}
                       @input=${this.handleInputChange}/>
                <label for="position">Position</label>
                <input type="text" id="position" name="position" placeholder="Position" .value=${this.newEmployee.position}
                       @input=${this.handleInputChange}/>
                <button class="btn" @click=${this.handleAddEmployee}>
                    ${this.isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
            </div>
        `;
    }
}

customElements.define('add-employee', AddEmployee);