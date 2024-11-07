import {css, html, LitElement} from 'lit';
import {employees} from "./src/data.js";

export class EmployeeManagement extends LitElement {
    static properties = {
        employees: {type: Array},
        viewMode: {type: String},
        searchTerm: {type: String},
        currentPage: {type: Number},
        itemsPerPage: {type: Number}
    };

    static styles = css`
        :host {
            display: block;
            padding: 1rem;
            max-width: 1200px;
            margin: 0 auto;
        }

        .container {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .search-input {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 250px;
        }

        .view-toggle {
            display: flex;
            gap: 0.5rem;
        }

        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .btn-primary {
            background: #3b82f6;
            color: white;
        }

        .btn-danger {
            background: #ef4444;
            color: white;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }

        th {
            background: #f9fafb;
            font-weight: 600;
        }

        .list-view {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .list-item {
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        .actions {
            display: flex;
            gap: 0.5rem;
        }
    `;

    constructor() {
        super();
        this.employees = employees;
        this.viewMode = 'table';
        this.searchTerm = '';
        this.currentPage = 1;
        this.itemsPerPage = 5;
    }

    get filteredEmployees() {
        return this.employees.filter(employee =>
            Object.values(employee).some(value =>
                String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
            )
        );
    }

    get paginatedEmployees() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredEmployees.slice(start, end);
    }

    get totalPages() {
        return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    }

    handleSearch(e) {
        this.searchTerm = e.target.value;
        this.currentPage = 1;
    }

    toggleView(mode) {
        this.viewMode = mode;
    }

    handleDelete(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            this.employees = this.employees.filter(emp => emp.id !== id);
            this.requestUpdate();
        }
    }

    navigateToAddEmployee(employee = null) {
        const url = new URL('/dev/add-employee.html', window.location.origin);
        if (employee) {
            url.searchParams.set('employee', JSON.stringify(employee));
        }
        window.location.href = url.toString();
    }

    renderTableView() {
        return html`
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                ${this.paginatedEmployees.map(employee => html`
                    <tr>
                        <td>${employee.firstName} ${employee.lastName}</td>
                        <td>${employee.department}</td>
                        <td>${employee.position}</td>
                        <td>
                            <div class="actions">
                                <button class="btn btn-primary" @click=${() => this.navigateToAddEmployee(employee)}>
                                    Edit
                                </button>
                                <button class="btn btn-danger" @click=${() => this.handleDelete(employee.id)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `)}
                </tbody>
            </table>
        `;
    }

    renderListView() {
        return html`
            <div class="list-view">
                ${this.paginatedEmployees.map(employee => html`
                    <div class="list-item">
                        <div>
                            <h3>${employee.firstName} ${employee.lastName}</h3>
                            <p>${employee.department} - ${employee.position}</p>
                        </div>
                        <div class="actions">
                            <button class="btn btn-primary" @click=${() => this.navigateToAddEmployee(employee)}>
                                Edit
                            </button>
                            <button class="btn btn-danger" @click=${() => this.handleDelete(employee.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    render() {
        return html`
            <div class="container">
                <div class="header">
                    <input
                            type="text"
                            class="search-input"
                            placeholder="Search employees..."
                            .value=${this.searchTerm}
                            @input=${this.handleSearch}
                    />
                    <div class="view-toggle">
                        <button
                                class="btn ${this.viewMode === 'table' ? 'btn-primary' : ''}"
                                @click=${() => this.toggleView('table')}
                        >
                            Table View
                        </button>
                        <button
                                class="btn ${this.viewMode === 'list' ? 'btn-primary' : ''}"
                                @click=${() => this.toggleView('list')}
                        >
                            List View
                        </button>
                    </div>
                    <button class="btn btn-primary" @click=${() => this.navigateToAddEmployee()}>
                        Add Employee
                    </button>
                </div>

                ${this.viewMode === 'table' ? this.renderTableView() : this.renderListView()}

                <div class="pagination">
                    <button
                            class="btn"
                            ?disabled=${this.currentPage === 1}
                            @click=${() => this.currentPage--}
                    >
                        Previous
                    </button>
                    <span>Page ${this.currentPage} of ${this.totalPages}</span>
                    <button
                            class="btn"
                            ?disabled=${this.currentPage === this.totalPages}
                            @click=${() => this.currentPage++}
                    >
                        Next
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('employee-management', EmployeeManagement);