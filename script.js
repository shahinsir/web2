// ==============================
// ADMIN SETTINGS - এখানে পরিবর্তন করুন
// ==============================
const ADMIN_PASSWORD = "shah82IN"; // আপনার পাসওয়ার্ড এখানে দিন
// পাসওয়ার্ড চেঞ্জ করুন: "শিক্ষা১২৩" এর জায়গায় আপনার পাসওয়ার্ড দিন
// ==============================

// Storage Key
const STORAGE_KEY = 'education_portal_admin_files';

// Check if running on mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Fix for mobile view
function requestDesktop() {
    if(isMobile()) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=1200');
        alert("ডেস্কটপ ভিউ চালু হয়েছে! পেজ রিফ্রেশ করুন।");
    }
}

// Mobile detection on load
window.addEventListener('load', function() {
    if(isMobile()) {
        console.log("Mobile device detected");
        // Add mobile-specific fixes
        document.body.style.overflowX = 'hidden';
        document.body.style.width = '100%';
    }
    
    // Load materials
    loadMaterials();
    
    // Check if admin was already logged in
    if(localStorage.getItem('admin_logged_in') === 'true') {
        showAdminPanel();
    }
});

// Admin Functions
function showAdminLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPass').focus();
}

function loginAdmin() {
    const password = document.getElementById('adminPass').value;
    
    if(password === ADMIN_PASSWORD) {
        // Success
        localStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
        alert("✅ অ্যাডমিন লগিন সফল!");
    } else {
        alert("❌ ভুল পাসওয়ার্ড! শুধু অ্যাডমিন এক্সেস করতে পারবে।");
    }
}

function showAdminPanel() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    alert("লগআউট সফল!");
}

// Add New File (Only Admin)
function addFile() {
    // Check if admin is logged in
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল যোগ করতে পারবেন!");
        showAdminLogin();
        return;
    }
    
    const fileClass = document.getElementById('fileClass').value;
    const fileSubject = document.getElementById('fileSubject').value;
    const fileType = document.getElementById('fileType').value;
    const fileName = document.getElementById('fileName').value;
    const fileLink = document.getElementById('fileLink').value;
    
    // Validation
    if(!fileLink) {
        alert("❌ লিংক দিন!");
        return;
    }
    
    // Class names in Bengali
    const classNames = {
        '6': 'ষষ্ঠ শ্রেণি',
        '7': 'সপ্তম শ্রেণি',
        '8': 'অষ্টম শ্রেণি',
        '9': 'নবম শ্রেণি',
        '10': 'দশম শ্রেণি'
    };
    
    // Subject names in Bengali
    const subjectNames = {
        'bangla': 'বাংলা',
        'english': 'ইংরেজি',
        'math': 'গণিত',
        'science': 'বিজ্ঞান',
        'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি',
        'agriculture': 'কৃষি শিক্ষা'
    };
    
    // Create file object
    const newFile = {
        id: Date.now(),
        class: fileClass,
        subject: fileSubject,
        type: fileType,
        name: fileName || `${classNames[fileClass]} - ${subjectNames[fileSubject]}`,
        link: fileLink,
        date: new Date().toLocaleDateString('bn-BD'),
        addedBy: 'Admin'
    };
    
    // Save to localStorage
    let files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    files.unshift(newFile); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    
    // Clear form
    document.getElementById('fileName').value = '';
    document.getElementById('fileLink').value = '';
    
    // Show success
    alert(`✅ ফাইল যোগ করা হয়েছে!\n${classNames[fileClass]} - ${subjectNames[fileSubject]}`);
    
    // Reload materials
    loadMaterials();
}

// Load and Display Materials
function loadMaterials() {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const container = document.getElementById('materialsGrid');
    
    if(files.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
                <h4>কোনো ফাইল পাওয়া যায়নি</h4>
                <p>অ্যাডমিন নতুন ফাইল যোগ করুন</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    files.forEach(file => {
        // Icons based on file type
        let icon = 'fa-file';
        let iconColor = 'primary';
        
        if(file.type === 'pdf') {
            icon = 'fa-file-pdf';
            iconColor = 'danger';
        } else if(file.type === 'video') {
            icon = 'fa-video';
            iconColor = 'danger';
        } else if(file.type === 'image') {
            icon = 'fa-image';
            iconColor = 'success';
        } else if(file.type === 'doc') {
            icon = 'fa-file-word';
            iconColor = 'primary';
        }
        
        // Class and subject names
        const classNames = {
            '6': 'ষষ্ঠ শ্রেণি',
            '7': 'সপ্তম শ্রেণি',
            '8': 'অষ্টম শ্রেণি',
            '9': 'নবম শ্রেণি',
            '10': 'দশম শ্রেণি'
        };
        
        const subjectNames = {
            'bangla': 'বাংলা',
            'english': 'ইংরেজি',
            'math': 'গণিত',
            'science': 'বিজ্ঞান',
            'ict': 'তথ্য ও যোগাযোগ প্রযুক্তি',
            'agriculture': 'কৃষি শিক্ষা'
        };
        
        html += `
            <div class="col-md-4 mb-4">
                <div class="card material-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <span class="badge bg-primary">${classNames[file.class]}</span>
                                <span class="badge bg-secondary ms-1">${subjectNames[file.subject]}</span>
                            </div>
                            <i class="fas ${icon} fa-2x text-${iconColor}"></i>
                        </div>
                        <h5 class="card-title">${file.name}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="fas fa-calendar"></i> ${file.date}<br>
                                <i class="fas fa-user-tie"></i> অ্যাডমিন দ্বারা যোগকৃত
                            </small>
                        </p>
                        <a href="${file.link}" target="_blank" class="btn btn-outline-primary w-100">
                            <i class="fas fa-external-link-alt"></i> ওপেন করুন
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Filter Materials
function filterMaterials() {
    const filterClass = document.getElementById('filterClass').value;
    const filterSubject = document.getElementById('filterSubject').value;
    const filterType = document.getElementById('filterType').value;
    
    const files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const container = document.getElementById('materialsGrid');
    
    if(files.length === 0) {
        loadMaterials();
        return;
    }
    
    // Filter files
    const filtered = files.filter(file => {
        if(filterClass !== 'all' && file.class !== filterClass) return false;
        if(filterSubject !== 'all' && file.subject !== filterSubject) return false;
        if(filterType !== 'all' && file.type !== filterType) return false;
        return true;
    });
    
    if(filtered.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h4>কোনো ফাইল পাওয়া যায়নি</h4>
                <p>অন্যান্য ফিল্টার চেষ্টা করুন</p>
            </div>
        `;
        return;
    }
    
    // Display filtered files
    let html = '';
    
    filtered.forEach(file => {
        let icon = 'fa-file';
        let iconColor = 'primary';
        
        if(file.type === 'pdf') icon = 'fa-file-pdf', iconColor = 'danger';
        else if(file.type === 'video') icon = 'fa-video', iconColor = 'danger';
        else if(file.type === 'image') icon = 'fa-image', iconColor = 'success';
        else if(file.type === 'doc') icon = 'fa-file-word', iconColor = 'primary';
        
        const classNames = {
            '6': 'ষষ্ঠ শ্রেণি', '7': 'সপ্তম শ্রেণি', '8': 'অষ্টম শ্রেণি',
            '9': 'নবম শ্রেণি', '10': 'দশম শ্রেণি'
        };
        
        const subjectNames = {
            'bangla': 'বাংলা', 'english': 'ইংরেজি', 'math': 'গণিত',
            'science': 'বিজ্ঞান', 'ict': 'ICT', 'agriculture': 'কৃষি শিক্ষা'
        };
        
        html += `
            <div class="col-md-4 mb-4">
                <div class="card material-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <span class="badge bg-primary">${classNames[file.class]}</span>
                                <span class="badge bg-secondary ms-1">${subjectNames[file.subject]}</span>
                            </div>
                            <i class="fas ${icon} fa-2x text-${iconColor}"></i>
                        </div>
                        <h5 class="card-title">${file.name}</h5>
                        <a href="${file.link}" target="_blank" class="btn btn-outline-primary w-100">
                            <i class="fas fa-external-link-alt"></i> ওপেন করুন
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Export/Import Functions (For Admin Backup)
function exportData() {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("শুধু অ্যাডমিন!");
        return;
    }
    
    const data = localStorage.getItem(STORAGE_KEY);
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'শিক্ষা_পোর্টাল_ব্যাকআপ.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert("✅ ডেটা এক্সপোর্ট সফল!");
}

function importData() {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("শুধু অ্যাডমিন!");
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                alert("✅ ডেটা ইম্পোর্ট সফল!");
                loadMaterials();
            } catch(err) {
                alert("❌ ভুল ফাইল ফরমেট!");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Initialize with sample data (First time only)
function initializeSampleData() {
    if(!localStorage.getItem(STORAGE_KEY)) {
        const sampleData = [
            {
                id: 1,
                class: "6",
                subject: "bangla",
                type: "pdf",
                name: "ষষ্ঠ শ্রেণি বাংলা বই",
                link: "https://drive.google.com/file/d/sample1/view",
                date: "২০২৪-০১-১৫",
                addedBy: "Admin"
            },
            {
                id: 2,
                class: "9",
                subject: "math",
                type: "video",
                name: "নবম শ্রেণি বীজগণিত ভিডিও",
                link: "https://youtube.com/watch?v=sample2",
                date: "২০২৪-০১-১৪",
                addedBy: "Admin"
            },
            {
                id: 3,
                class: "10",
                subject: "science",
                type: "pdf",
                name: "দশম শ্রেণি পদার্থ বিজ্ঞান",
                link: "https://drive.google.com/file/d/sample3/view",
                date: "২০২৪-০১-১৩",
                addedBy: "Admin"
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    }
}

// Call this on first load
initializeSampleData();