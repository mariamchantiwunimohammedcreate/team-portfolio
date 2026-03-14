let projects = [];
let editingId = null;
let deleteId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    displayProjects();
    setupFormListener();
});

// Load projects from localStorage
function loadProjects() {
    const saved = localStorage.getItem('portfolioProjects');
    projects = saved ? JSON.parse(saved) : [];
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Display projects
function displayProjects() {
    const grid = document.getElementById('projectsGrid');
    const emptyState = document.getElementById('emptyState');
    
    grid.innerHTML = '';

    if (projects.length === 0) {
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    projects.forEach(project => {
        const card = createProjectCard(project);
        grid.appendChild(card);
    });
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.id = `project-${project.id}`;

    const technologies = project.technologies.split(',').map(t => t.trim());
    const teamMembers = project.teamMembers ? project.teamMembers.split(',').map(m => m.trim()) : [];

    card.innerHTML = `
        <div class="project-card-header">
            <h3>${escapeHtml(project.name)}</h3>
        </div>
        <div class="project-card-body">
            <p class="project-description">${escapeHtml(project.description)}</p>
            
            <div class="project-technologies">
                <label>Technologies:</label>
                <div class="tech-tags">
                    ${technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
            </div>

            ${teamMembers.length > 0 ? `
                <div class="project-team">
                    <label>Team Members:</label>
                    <div class="team-members">
                        ${teamMembers.map(member => `<span class="team-member">${escapeHtml(member)}</span>`).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="project-links">
                ${project.code ? `<div class="project-link"><a href="${escapeHtml(project.code)}" target="_blank">📄 Code</a></div>` : ''}
                ${project.liveDemo ? `<div class="project-link"><a href="${escapeHtml(project.liveDemo)}" target="_blank">🌐 Live Demo</a></div>` : ''}
            </div>

            <div class="card-actions">
                <button class="btn-edit" onclick="editProject(${project.id})">Edit</button>
                <button class="btn-delete" onclick="deleteProject(${project.id})">Delete</button>
            </div>
        </div>
    `;

    return card;
}

// Open Add Project Modal
function openAddProjectModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Project';
    document.getElementById('projectForm').reset();
    document.getElementById('projectModal').classList.add('show');
}

// Close Add Project Modal
function closeAddProjectModal() {
    document.getElementById('projectModal').classList.remove('show');
    document.getElementById('projectForm').reset();
    editingId = null;
}

// Setup form listener
function setupFormListener() {
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProjectData();
    });
}

// Save project data
function saveProjectData() {
    const name = document.getElementById('projectName').value.trim();
    const description = document.getElementById('projectDescription').value.trim();
    const technologies = document.getElementById('projectTechnologies').value.trim();
    const teamMembers = document.getElementById('projectTeamMembers').value.trim();
    const code = document.getElementById('projectCode').value.trim();
    const liveDemo = document.getElementById('projectLiveDemo').value.trim();

    if (!name || !description || !technologies) {
        alert('Please fill in all required fields');
        return;
    }

    if (editingId !== null) {
        // Update existing project
        const projectIndex = projects.findIndex(p => p.id === editingId);
        projects[projectIndex] = {
            ...projects[projectIndex],
            name,
            description,
            technologies,
            teamMembers,
            code,
            liveDemo
        };
    } else {
        // Create new project
        const newProject = {
            id: Date.now(),
            name,
            description,
            technologies,
            teamMembers,
            code,
            liveDemo,
            createdAt: new Date().toLocaleDateString()
        };
        projects.push(newProject);
    }

    saveProjects();
    displayProjects();
    closeAddProjectModal();
    alert('Project saved successfully!');
}

// Edit project
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Project';
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDescription').value = project.description;
    document.getElementById('projectTechnologies').value = project.technologies;
    document.getElementById('projectTeamMembers').value = project.teamMembers || '';
    document.getElementById('projectCode').value = project.code || '';
    document.getElementById('projectLiveDemo').value = project.liveDemo || '';
    document.getElementById('projectModal').classList.add('show');
}

// Delete project - Show confirmation
function deleteProject(id) {
    deleteId = id;
    const project = projects.find(p => p.id === id);
    if (project) {
        document.getElementById('deleteMessage').textContent = `Are you sure you want to delete "${escapeHtml(project.name)}"? This action cannot be undone.`;
    }
    document.getElementById('deleteModal').classList.add('show');
}

// Confirm delete
function confirmDelete() {
    if (deleteId !== null) {
        projects = projects.filter(p => p.id !== deleteId);
        saveProjects();
        displayProjects();
        cancelDelete();
        alert('Project deleted successfully!');
    }
}

// Cancel delete
function cancelDelete() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteId = null;
}

// Search projects
function searchProjects() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        const projectName = card.querySelector('.project-card-header h3').textContent.toLowerCase();
        const projectDesc = card.querySelector('.project-description').textContent.toLowerCase();
        
        if (projectName.includes(searchTerm) || projectDesc.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}