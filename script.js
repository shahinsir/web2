// ==============================
// ADMIN SETTINGS - এখানে পরিবর্তন করুন
// ==============================
const ADMIN_PASSWORD = "shah82IN"; // আপনার পাসওয়ার্ড এখানে দিন

// Storage Keys
const STORAGE_KEY = 'education_portal_admin_files';
const FEEDBACK_KEY = 'education_portal_feedback';

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
        document.body.style.overflowX = 'hidden';
        document.body.style.width = '100%';
    }
    
    loadMaterials();
    loadFileManagementTable();
    
    if(localStorage.getItem('admin_logged_in') === 'true') {
        showAdminPanel();
    }
});

// Admin Functions (পুরানো ঠিক আছে)
function showAdminLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('adminPass').focus();
}

function loginAdmin() {
    const password = document.getElementById('adminPass').value;
    
    if(password === ADMIN_PASSWORD) {
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
    loadFileManagementTable();
}

function logoutAdmin() {
    localStorage.removeItem('admin_logged_in');
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
    alert("লগআউট সফল!");
}

// Add New File (পুরানো ঠিক আছে)
function addFile() {
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
    
    if(!fileLink) {
        alert("❌ লিংক দিন!");
        return;
    }
    
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
    
    let files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    files.unshift(newFile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    
    document.getElementById('fileName').value = '';
    document.getElementById('fileLink').value = '';
    
    alert(`✅ ফাইল যোগ করা হয়েছে!\n${classNames[fileClass]} - ${subjectNames[fileSubject]}`);
    
    loadMaterials();
    loadFileManagementTable();
}

// NEW FUNCTION: Handle Direct File Upload (ছবি/ভিডিও সরাসরি)
function handleDirectUpload(input) {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল আপলোড করতে পারবেন!");
        return;
    }
    
    const file = input.files[0];
    if (!file) return;
    
    // File size check (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        alert("❌ ফাইলের সাইজ 10MB এর বেশি হতে পারবে না!");
        return;
    }
    
    // File type check
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];
    if (!validTypes.includes(file.type)) {
        alert("❌ শুধু ছবি (JPG, PNG, GIF) এবং ভিডিও (MP4, AVI) ফাইল আপলোড করা যাবে!");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Create a Base64 string
        const base64String = e.target.result;
        
        // For images and videos, we'll store as Base64 (for small files)
        // For larger files, in real application you would upload to server
        // Since this is GitHub Pages, we'll use Base64 for demo
        
        const fileClass = document.getElementById('fileClass').value;
        const fileSubject = document.getElementById('fileSubject').value;
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        const fileName = document.getElementById('fileName').value || file.name;
        
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
            'ict': 'ICT',
            'agriculture': 'কৃষি শিক্ষা'
        };
        
        const newFile = {
            id: Date.now(),
            class: fileClass,
            subject: fileSubject,
            type: fileType,
            name: fileName,
            link: base64String, // Storing as Base64
            date: new Date().toLocaleDateString('bn-BD'),
            addedBy: 'Admin',
            isBase64: true
        };
        
        let files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        files.unshift(newFile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
        
        alert(`✅ ${fileType === 'image' ? 'ছবি' : 'ভিডিও'} আপলোড সফল!`);
        
        // Show preview
        const previewDiv = document.getElementById('uploadPreview');
        if (fileType === 'image') {
            previewDiv.innerHTML = `
                <div class="alert alert-success">
                    <p>ছবি আপলোড সফল!</p>
                    <img src="${base64String}" class="file-preview" style="max-width: 200px;">
                </div>
            `;
        } else {
            previewDiv.innerHTML = `
                <div class="alert alert-success">
                    <p>ভিডিও আপলোড সফল!</p>
                    <video controls class="video-preview" style="max-width: 300px;">
                        <source src="${base64String}" type="${file.type}">
                    </video>
                </div>
            `;
        }
        
        loadMaterials();
        loadFileManagementTable();
        input.value = ''; // Reset file input
    };
    
    reader.readAsDataURL(file);
}

// NEW FUNCTION: Load File Management Table
function loadFileManagementTable() {
    if(localStorage.getItem('admin_logged_in') !== 'true') return;
    
    const files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const tableBody = document.getElementById('fileManagementTable');
    
    if(files.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">কোনো ফাইল পাওয়া যায়নি</td>
            </tr>
        `;
        return;
    }
    
    const classNames = {
        '6': '৬ষ্ঠ', '7': '৭ম', '8': '৮ম', '9': '৯ম', '10': '১০ম'
    };
    
    const subjectNames = {
        'bangla': 'বাংলা', 'english': 'ইং', 'math': 'গণিত', 
        'science': 'বিজ্ঞান', 'ict': 'ICT', 'agriculture': 'কৃষি'
    };
    
    let html = '';
    
    files.forEach(file => {
        html += `
            <tr>
                <td>${file.name.substring(0, 30)}${file.name.length > 30 ? '...' : ''}</td>
                <td>${classNames[file.class]}</td>
                <td>${subjectNames[file.subject]}</td>
                <td>
                    <span class="badge ${file.type === 'pdf' ? 'bg-danger' : 
                                     file.type === 'video' ? 'bg-warning' : 
                                     file.type === 'image' ? 'bg-success' : 'bg-primary'}">
                        ${file.type}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id})">
                        <i class="fas fa-trash"></i> ডিলিট
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// NEW FUNCTION: Delete File
function deleteFile(fileId) {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল ডিলিট করতে পারবেন!");
        return;
    }
    
    if(!confirm("আপনি কি নিশ্চিত এই ফাইলটি ডিলিট করতে চান?")) {
        return;
    }
    
    let files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    files = files.filter(file => file.id !== fileId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    
    alert("✅ ফাইল ডিলিট করা হয়েছে!");
    loadMaterials();
    loadFileManagementTable();
}

// NEW FUNCTION: Submit Feedback
function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    
    if(!feedbackText.trim()) {
        alert("❌ মতামত লিখুন!");
        return;
    }
    
    const feedback = {
        id: Date.now(),
        text: feedbackText,
        date: new Date().toLocaleString('bn-BD'),
        ip: 'user'
    };
    
    let feedbacks = JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || [];
    feedbacks.unshift(feedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
    
    document.getElementById('feedbackText').value = '';
    alert("✅ আপনার মতামত সংরক্ষিত হয়েছে! ধন্যবাদ।");
}

// Load and Display Materials (পুরানো ঠিক আছে - শুধু Base64 support যোগ করা হয়েছে)
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
        
        // For Base64 files, show preview
        let fileContent = '';
        if(file.isBase64 && file.type === 'image') {
            fileContent = `
                <div class="text-center mb-3">
                    <img src="${file.link}" class="file-preview" alt="${file.name}">
                </div>
            `;
        } else if(file.isBase64 && file.type === 'video') {
            fileContent = `
                <div class="text-center mb-3">
                    <video controls class="video-preview">
                        <source src="${file.link}" type="video/mp4">
                    </video>
                </div>
            `;
        }
        
        html += `
            <div class="col-md-4 mb-4">
                <div class="card material-card h-100" style="position: relative;">
                    ${localStorage.getItem('admin_logged_in') === 'true' ? `
                        <button class="btn btn-sm btn-danger delete-btn" onclick="deleteFile(${file.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                    <div class="card-body">
                        ${fileContent}
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
                        <a href="${file.link}" ${file.isBase64 ? '' : 'target="_blank"'} 
                           class="btn btn-outline-primary w-100">
                            <i class="fas fa-external-link-alt"></i> 
                            ${file.type === 'image' || file.type === 'video' ? 'দেখুন' : 'ওপেন করুন'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Filter Materials (পুরানো ঠিক আছে)
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
        
        let fileContent = '';
        if(file.isBase64 && file.type === 'image') {
            fileContent = `
                <div class="text-center mb-3">
                    <img src="${file.link}" class="file-preview" alt="${file.name}">
                </div>
            `;
        } else if(file.isBase64 && file.type === 'video') {
            fileContent = `
                <div class="text-center mb-3">
                    <video controls class="video-preview">
                        <source src="${file.link}" type="video/mp4">
                    </video>
                </div>
            `;
        }
        
        html += `
            <div class="col-md-4 mb-4">
                <div class="card material-card h-100" style="position: relative;">
                    ${localStorage.getItem('admin_logged_in') === 'true' ? `
                        <button class="btn btn-sm btn-danger delete-btn" onclick="deleteFile(${file.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                    <div class="card-body">
                        ${fileContent}
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <span class="badge bg-primary">${classNames[file.class]}</span>
                                <span class="badge bg-secondary ms-1">${subjectNames[file.subject]}</span>
                            </div>
                            <i class="fas ${icon} fa-2x text-${iconColor}"></i>
                        </div>
                        <h5 class="card-title">${file.name}</h5>
                        <a href="${file.link}" ${file.isBase64 ? '' : 'target="_blank"'} 
                           class="btn btn-outline-primary w-100">
                            <i class="fas fa-external-link-alt"></i> 
                            ${file.type === 'image' || file.type === 'video' ? 'দেখুন' : 'ওপেন করুন'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Export/Import Functions (For Admin Backup) - পুরানো
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
                loadFileManagementTable();
            } catch(err) {
                alert("❌ ভুল ফাইল ফরমেট!");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Initialize with sample data
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