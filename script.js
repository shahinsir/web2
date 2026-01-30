// ==============================
// EDUCATION PORTAL - Supabase Version
// ==============================

const ADMIN_PASSWORD = "shah82IN";

// Configuration
const config = {
    maxFileSize: {
        image: 5 * 1024 * 1024,      // 5MB
        video: 50 * 1024 * 1024,     // 50MB
        pdf: 10 * 1024 * 1024,       // 10MB
        document: 5 * 1024 * 1024    // 5MB
    },
    allowedTypes: {
        image: ['image/jpeg', 'image/jpg', 'image/png'],
        video: ['video/mp4', 'video/webm'],
        pdf: ['application/pdf'],
        document: ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
};

// Class and Subject Names
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

// Global variables
let currentFiles = [];
let isLoading = false;

// ==============================
// INITIALIZATION
// ==============================

window.addEventListener('load', async function() {
    console.log("🚀 শিক্ষা পোর্টাল লোড হচ্ছে...");
    
    // Check admin login
    if(localStorage.getItem('admin_logged_in') === 'true') {
        showAdminPanel();
    }
    
    // Load initial data
    await loadStats();
    await loadMaterials();
    
    // Load file management table if admin
    if(localStorage.getItem('admin_logged_in') === 'true') {
        await loadFileManagementTable();
    }
});

// ==============================
// ADMIN FUNCTIONS
// ==============================

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
        alert("❌ ভুল পাসওয়ার্ড!");
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

// ==============================
// DATABASE FUNCTIONS
// ==============================

// Load files from Supabase
async function loadMaterials() {
    if (isLoading) return;
    
    isLoading = true;
    const container = document.getElementById('materialsGrid');
    
    try {
        // Show loading
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">ফাইলগুলো লোড হচ্ছে...</p>
            </div>
        `;
        
        // Get files from Supabase
        const { data: files, error } = await supabase
            .from('files')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        currentFiles = files || [];
        
        // Display files
        if (!currentFiles || currentFiles.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <h4>কোনো ফাইল পাওয়া যায়নি</h4>
                    <p>অ্যাডমিন নতুন ফাইল যোগ করুন</p>
                </div>
            `;
        } else {
            displayFiles(currentFiles);
        }
        
        // Update stats
        await loadStats();
        
    } catch (error) {
        console.error("Error loading materials:", error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-4x text-danger mb-3"></i>
                <h4>ফাইল লোড করতে সমস্যা হয়েছে</h4>
                <p>${error.message}</p>
                <button class="btn btn-primary mt-3" onclick="loadMaterials()">
                    <i class="fas fa-redo"></i> আবার চেষ্টা করুন
                </button>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// Display files in grid
function displayFiles(files) {
    const container = document.getElementById('materialsGrid');
    let html = '';
    
    files.forEach(file => {
        html += createFileCard(file);
    });
    
    container.innerHTML = html;
}

// Create file card HTML
function createFileCard(file) {
    // Get icon and color
    const { icon, iconColor, badgeColor } = getFileIconInfo(file.type);
    
    // Format date
    const date = file.created_at ? new Date(file.created_at).toLocaleDateString('bn-BD') : 'তারিখ নেই';
    
    // Determine file category
    const isImage = file.type === 'image';
    const isVideo = file.type === 'video';
    const isPdf = file.type === 'pdf';
    
    // Create preview based on file type
    let previewContent = '';
    let actionButton = '';
    
    if (isImage && file.file_url) {
        previewContent = `
            <div class="text-center mb-3">
                <img src="${file.file_url}" 
                     class="file-preview" 
                     style="max-height: 150px; width: auto; cursor: pointer;"
                     onclick="openImageModal('${file.file_url}', '${file.name}')"
                     onload="incrementViews(${file.id})"
                     onerror="this.src='https://via.placeholder.com/300x200?text=ছবি+লোড+ব্যর্থ'">
            </div>
        `;
        actionButton = `
            <a href="${file.file_url}" 
               download="${file.name}.jpg" 
               class="btn btn-sm btn-success"
               onclick="incrementDownloads(${file.id})">
                <i class="fas fa-download"></i> ডাউনলোড
            </a>
        `;
    } else if (isVideo) {
        if (file.file_url && (file.file_url.includes('youtube.com') || file.file_url.includes('youtu.be'))) {
            const videoId = extractYouTubeId(file.file_url);
            previewContent = `
                <div class="ratio ratio-16x9 mb-3">
                    <iframe src="https://www.youtube.com/embed/${videoId}" 
                            frameborder="0" 
                            allowfullscreen
                            onload="incrementViews(${file.id})">
                    </iframe>
                </div>
            `;
            actionButton = `
                <a href="${file.file_url}" 
                   target="_blank" 
                   class="btn btn-sm btn-danger">
                    <i class="fab fa-youtube"></i> YouTube
                </a>
            `;
        } else {
            previewContent = `
                <div class="text-center mb-3">
                    <i class="fas fa-video fa-3x text-danger"></i>
                    <p class="mt-2">ভিডিও ফাইল</p>
                </div>
            `;
            actionButton = `
                <a href="${file.file_url}" 
                   target="_blank" 
                   class="btn btn-sm btn-danger"
                   onclick="incrementDownloads(${file.id})">
                    <i class="fas fa-download"></i> ডাউনলোড
                </a>
            `;
        }
    } else if (isPdf) {
        previewContent = `
            <div class="text-center mb-3">
                <i class="fas fa-file-pdf fa-3x text-danger"></i>
                <p class="mt-2">PDF ডকুমেন্ট</p>
            </div>
        `;
        actionButton = `
            <a href="${file.file_url}" 
               target="_blank" 
               class="btn btn-sm btn-danger"
               onclick="incrementDownloads(${file.id})">
                <i class="fas fa-download"></i> ডাউনলোড
            </a>
        `;
    } else {
        previewContent = `
            <div class="text-center mb-3">
                <i class="fas ${icon} fa-3x text-${iconColor}"></i>
                <p class="mt-2">${file.type.toUpperCase()} ফাইল</p>
            </div>
        `;
        actionButton = `
            <a href="${file.file_url}" 
               target="_blank" 
               class="btn btn-sm btn-${iconColor}"
               onclick="incrementDownloads(${file.id})">
                <i class="fas fa-download"></i> ডাউনলোড
            </a>
        `;
    }
    
    return `
        <div class="col-md-4 mb-4">
            <div class="card material-card h-100 file-card">
                ${localStorage.getItem('admin_logged_in') === 'true' ? `
                    <button class="btn btn-sm btn-danger delete-btn" onclick="deleteFile(${file.id}, '${file.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
                
                ${file.file_url && file.file_url.includes('supabase.co') ? `
                    <span class="badge bg-info file-badge">
                        <i class="fas fa-cloud"></i> সরাসরি
                    </span>
                ` : ''}
                
                <div class="card-body">
                    ${previewContent}
                    
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="badge bg-primary">${classNames[file.class] || file.class}</span>
                            <span class="badge bg-secondary ms-1">${subjectNames[file.subject] || file.subject}</span>
                        </div>
                        <i class="fas ${icon} fa-2x text-${iconColor}"></i>
                    </div>
                    
                    <h6 class="card-title">${file.name}</h6>
                    
                    ${file.file_size ? `
                        <p class="small text-muted mb-2">
                            <i class="fas fa-hdd"></i> ${file.file_size}
                        </p>
                    ` : ''}
                    
                    <p class="card-text">
                        <small class="text-muted">
                            <i class="fas fa-calendar"></i> ${date}
                        </small>
                    </p>
                    
                    <div class="mt-3 d-flex justify-content-between">
                        ${actionButton}
                        <button class="btn btn-sm btn-outline-secondary" 
                                onclick="copyToClipboard('${file.file_url}')">
                            <i class="fas fa-copy"></i> লিংক
                        </button>
                    </div>
                    
                    <div class="mt-2 text-center">
                        <small class="text-muted">
                            <i class="fas fa-eye"></i> ${file.views || 0} বার দেখা | 
                            <i class="fas fa-download"></i> ${file.downloads || 0} বার ডাউনলোড
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Filter materials
function filterMaterials() {
    const filterClass = document.getElementById('filterClass').value;
    const filterSubject = document.getElementById('filterSubject').value;
    const filterType = document.getElementById('filterType').value;
    
    if (!currentFiles || currentFiles.length === 0) {
        loadMaterials();
        return;
    }
    
    const filtered = currentFiles.filter(file => {
        if (filterClass !== 'all' && file.class !== filterClass) return false;
        if (filterSubject !== 'all' && file.subject !== filterSubject) return false;
        if (filterType !== 'all' && file.type !== filterType) return false;
        return true;
    });
    
    if (filtered.length === 0) {
        document.getElementById('materialsGrid').innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h4>কোনো ফাইল পাওয়া যায়নি</h4>
                <p>অন্যান্য ফিল্টার চেষ্টা করুন</p>
            </div>
        `;
    } else {
        displayFiles(filtered);
    }
}

// ==============================
// FILE UPLOAD FUNCTIONS
// ==============================

// Handle direct file upload
async function handleDirectUpload(input) {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল আপলোড করতে পারবেন!");
        showAdminLogin();
        return;
    }
    
    const file = input.files[0];
    if (!file) return;
    
    const previewDiv = document.getElementById('uploadPreview');
    
    // Determine file category
    let category = 'document';
    if (file.type.startsWith('image/')) category = 'image';
    else if (file.type.startsWith('video/')) category = 'video';
    else if (file.type === 'application/pdf') category = 'pdf';
    
    // Validate file
    const validation = validateFile(file, category);
    if (!validation.valid) {
        alert(`❌ ${validation.message}`);
        input.value = '';
        return;
    }
    
    // Show loading
    previewDiv.innerHTML = `
        <div class="alert alert-info">
            <div class="spinner-border spinner-border-sm"></div>
            ${file.name} আপলোড হচ্ছে...
            <div class="progress mt-2">
                <div id="uploadProgress" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%"></div>
            </div>
        </div>
    `;
    
    try {
        // Create unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `public/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('files')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                onUploadProgress: (progress) => {
                    const percent = (progress.loaded / progress.total) * 100;
                    document.getElementById('uploadProgress').style.width = percent + '%';
                }
            });
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from('files')
            .getPublicUrl(filePath);
        
        // Get form data
        const fileClass = document.getElementById('fileClass').value;
        const fileSubject = document.getElementById('fileSubject').value;
        const fileType = category;
        const fileNameInput = document.getElementById('fileName').value || file.name.replace(/\.[^/.]+$/, "");
        const fileSize = formatFileSize(file.size);
        
        // Prepare file data for database
        const fileData = {
            class: fileClass,
            subject: fileSubject,
            type: fileType,
            name: fileNameInput,
            file_url: urlData.publicUrl,
            file_size: fileSize,
            created_by: 'admin'
        };
        
        // Save to database
        const { data: dbData, error: dbError } = await supabase
            .from('files')
            .insert([fileData])
            .select();
        
        if (dbError) throw dbError;
        
        // Show success message
        previewDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i> ফাইল আপলোড সফল!
                
                ${category === 'image' ? `
                    <div class="mt-3">
                        <img src="${urlData.publicUrl}" class="file-preview" style="max-width: 200px;">
                    </div>
                ` : ''}
                
                ${category === 'video' ? `
                    <div class="mt-3">
                        <video controls class="video-preview" style="max-width: 300px;">
                            <source src="${urlData.publicUrl}" type="${file.type}">
                        </video>
                    </div>
                ` : ''}
                
                <p class="mt-2 mb-0">
                    <small>
                        <strong>লিংক:</strong><br>
                        <input type="text" class="form-control form-control-sm mt-1" 
                               value="${urlData.publicUrl}" readonly onclick="this.select()">
                    </small>
                </p>
            </div>
        `;
        
        // Clear form
        document.getElementById('fileName').value = '';
        input.value = '';
        
        // Refresh lists
        await Promise.all([
            loadMaterials(),
            loadFileManagementTable(),
            loadStats()
        ]);
        
    } catch (error) {
        console.error("Upload Error:", error);
        previewDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                আপলোড ব্যর্থ: ${error.message}
            </div>
        `;
    }
}

// Add external link (Google Drive, YouTube, etc.)
async function addExternalLink() {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল যোগ করতে পারবেন!");
        showAdminLogin();
        return;
    }
    
    const link = document.getElementById('fileLink').value;
    const fileClass = document.getElementById('fileClass').value;
    const fileSubject = document.getElementById('fileSubject').value;
    const fileType = document.getElementById('fileType').value;
    const fileName = document.getElementById('fileName').value;
    
    if(!link) {
        alert("❌ লিংক দিন!");
        return;
    }
    
    if(!link.startsWith('http')) {
        alert("❌ সঠিক লিংক দিন (http/https সহ)!");
        return;
    }
    
    try {
        // Process Google Drive link
        let processedLink = link;
        if (link.includes('drive.google.com/file/d/')) {
            const fileId = extractGoogleDriveId(link);
            if (fileId) {
                processedLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
            }
        }
        
        // Prepare file data
        const fileData = {
            class: fileClass,
            subject: fileSubject,
            type: fileType,
            name: fileName || `${classNames[fileClass]} - ${subjectNames[fileSubject]}`,
            file_url: processedLink,
            created_by: 'admin'
        };
        
        // Save to database
        const { data, error } = await supabase
            .from('files')
            .insert([fileData])
            .select();
        
        if (error) throw error;
        
        alert("✅ ফাইল যোগ করা হয়েছে!");
        
        // Clear form
        document.getElementById('fileName').value = '';
        document.getElementById('fileLink').value = '';
        
        // Refresh
        await Promise.all([
            loadMaterials(),
            loadFileManagementTable(),
            loadStats()
        ]);
        
    } catch (error) {
        console.error("Error adding file:", error);
        alert(`❌ ফাইল যোগ করতে সমস্যা: ${error.message}`);
    }
}

// ==============================
// FILE MANAGEMENT
// ==============================

// Load file management table
async function loadFileManagementTable() {
    if(localStorage.getItem('admin_logged_in') !== 'true') return;
    
    const tableBody = document.getElementById('fileManagementTable');
    
    try {
        const { data: files, error } = await supabase
            .from('files')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!files || files.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">কোনো ফাইল পাওয়া যায়নি</td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        
        files.forEach(file => {
            const fileTypeText = file.type === 'image' ? 'ছবি' : 
                               file.type === 'video' ? 'ভিডিও' : 
                               file.type === 'pdf' ? 'PDF' : 'ফাইল';
            
            html += `
                <tr>
                    <td>${file.name.substring(0, 25)}${file.name.length > 25 ? '...' : ''}</td>
                    <td>${classNames[file.class] || file.class}</td>
                    <td>${subjectNames[file.subject] || file.subject}</td>
                    <td>
                        <span class="badge ${getFileIconInfo(file.type).badgeColor}">
                            ${fileTypeText}
                        </span>
                    </td>
                    <td>${file.file_size || '-'}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id}, '${file.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
    } catch (error) {
        console.error("Error loading file table:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">লোড করতে সমস্যা হয়েছে</td>
            </tr>
        `;
    }
}

// Delete file
async function deleteFile(fileId, fileName) {
    if(localStorage.getItem('admin_logged_in') !== 'true') {
        alert("❌ শুধু অ্যাডমিন ফাইল ডিলিট করতে পারবেন!");
        return;
    }
    
    if(!confirm(`আপনি কি নিশ্চিত "${fileName}" ফাইলটি ডিলিট করতে চান?`)) {
        return;
    }
    
    try {
        // First get file info
        const { data: fileData, error: fetchError } = await supabase
            .from('files')
            .select('file_url')
            .eq('id', fileId)
            .single();
        
        if (fetchError) throw fetchError;
        
        // Delete from storage if it's a Supabase URL
        if (fileData.file_url && fileData.file_url.includes('supabase.co/storage/v1')) {
            const filePath = fileData.file_url.split('/').pop();
            const { error: storageError } = await supabase.storage
                .from('files')
                .remove([`public/${filePath}`]);
            
            if (storageError) {
                console.warn('Storage delete failed:', storageError);
                // Continue anyway
            }
        }
        
        // Delete from database
        const { error: deleteError } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);
        
        if (deleteError) throw deleteError;
        
        alert("✅ ফাইল ডিলিট করা হয়েছে!");
        
        // Refresh
        await Promise.all([
            loadMaterials(),
            loadFileManagementTable(),
            loadStats()
        ]);
        
    } catch (error) {
        console.error("Error deleting file:", error);
        alert(`❌ ফাইল ডিলিট করতে সমস্যা: ${error.message}`);
    }
}

// ==============================
// STATS & ANALYTICS
// ==============================

// Load statistics
async function loadStats() {
    try {
        // Get total files count
        const { count: totalFiles, error: countError } = await supabase
            .from('files')
            .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Get total downloads
        const { data: filesData, error: filesError } = await supabase
            .from('files')
            .select('downloads');
        
        if (filesError) throw filesError;
        
        const totalDownloads = filesData.reduce((sum, file) => sum + (file.downloads || 0), 0);
        
        // Update UI
        document.getElementById('totalFiles').textContent = `মোট ফাইল: ${totalFiles || 0}`;
        document.getElementById('totalDownloads').textContent = `মোট ডাউনলোড: ${totalDownloads}`;
        
        if (document.getElementById('totalFilesFooter')) {
            document.getElementById('totalFilesFooter').textContent = `ফাইল: ${totalFiles || 0}`;
            document.getElementById('totalDownloadsFooter').textContent = `ডাউনলোড: ${totalDownloads}`;
        }
        
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

// Increment views
async function incrementViews(fileId) {
    try {
        // Get current views
        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('views')
            .eq('id', fileId)
            .single();
        
        if (fetchError) return;
        
        // Update views
        await supabase
            .from('files')
            .update({ views: (file.views || 0) + 1 })
            .eq('id', fileId);
        
    } catch (error) {
        console.error("Error incrementing views:", error);
    }
}

// Increment downloads
async function incrementDownloads(fileId) {
    try {
        // Get current downloads
        const { data: file, error: fetchError } = await supabase
            .from('files')
            .select('downloads')
            .eq('id', fileId)
            .single();
        
        if (fetchError) return;
        
        // Update downloads
        await supabase
            .from('files')
            .update({ downloads: (file.downloads || 0) + 1 })
            .eq('id', fileId);
        
        // Update stats
        await loadStats();
        
    } catch (error) {
        console.error("Error incrementing downloads:", error);
    }
}

// ==============================
// HELPER FUNCTIONS
// ==============================

// Validate file
function validateFile(file, category) {
    // Check file size
    if (file.size > config.maxFileSize[category]) {
        const maxSize = formatFileSize(config.maxFileSize[category]);
        return {
            valid: false,
            message: `ফাইল সাইজ ${maxSize} এর বেশি হতে পারবে না`
        };
    }
    
    // Check file type
    if (!config.allowedTypes[category].includes(file.type)) {
        return {
            valid: false,
            message: `${category} ফাইলের ধরন সঠিক নয়`
        };
    }
    
    return { valid: true };
}

// Get file icon info
function getFileIconInfo(fileType) {
    switch(fileType) {
        case 'pdf':
            return { icon: 'fa-file-pdf', iconColor: 'danger', badgeColor: 'bg-danger' };
        case 'video':
            return { icon: 'fa-video', iconColor: 'danger', badgeColor: 'bg-warning text-dark' };
        case 'image':
            return { icon: 'fa-image', iconColor: 'success', badgeColor: 'bg-success' };
        case 'doc':
            return { icon: 'fa-file-word', iconColor: 'primary', badgeColor: 'bg-primary' };
        default:
            return { icon: 'fa-file', iconColor: 'secondary', badgeColor: 'bg-secondary' };
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Extract YouTube ID from URL
function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Extract Google Drive ID from URL
function extractGoogleDriveId(url) {
    const match = url.match(/\/d\/([^\/]+)/);
    return match ? match[1] : null;
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("✅ লিংক কপি করা হয়েছে!");
    }).catch(err => {
        console.error("Copy failed:", err);
    });
}

// Open image modal
function openImageModal(src, title) {
    const modalHTML = `
        <div class="modal fade" id="imageModal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${src}" class="img-fluid">
                    </div>
                    <div class="modal-footer">
                        <a href="${src}" download="${title}.jpg" class="btn btn-success">
                            <i class="fas fa-download"></i> ডাউনলোড
                        </a>
                        <button class="btn btn-secondary" data-bs-dismiss="modal">বন্ধ</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    if(!document.getElementById('imageModal')) {
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
}

// Submit feedback
async function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    
    if(!feedbackText.trim()) {
        alert("❌ মতামত লিখুন!");
        return;
    }
    
    try {
        const { error } = await supabase
            .from('feedback')
            .insert([{
                message: feedbackText,
                user_name: 'anonymous'
            }]);
        
        if (error) throw error;
        
        document.getElementById('feedbackText').value = '';
        alert("✅ আপনার মতামত সংরক্ষিত হয়েছে! ধন্যবাদ।");
        
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("❌ মতামত জমা দিতে সমস্যা হয়েছে!");
    }
}

// ==============================
// TEST FUNCTIONS
// ==============================

// Test database connection
async function testDatabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('files')
            .select('count(*)', { count: 'exact', head: true });
        
        if (error) throw error;
        
        alert(`✅ ডাটাবেস কানেক্টেড!\nমোট ফাইল: ${data || 0}`);
        
    } catch (error) {
        console.error("Database Error:", error);
        alert(`❌ ডাটাবেস কানেকশন ব্যর্থ!\n${error.message}`);
    }
}

// Test storage upload
async function testStorageUpload() {
    try {
        // Create a test file
        const testContent = "This is a test file for education portal";
        const testFile = new File([testContent], "test.txt", { type: "text/plain" });
        
        // Upload
        const { data, error } = await supabase.storage
            .from('files')
            .upload('test/test-file.txt', testFile);
        
        if (error) throw error;
        
        // Get URL
        const { data: urlData } = supabase.storage
            .from('files')
            .getPublicUrl('test/test-file.txt');
        
        alert(`✅ স্টোরেজ আপলোড সফল!\nURL: ${urlData.publicUrl}`);
        
        // Clean up
        await supabase.storage
            .from('files')
            .remove(['test/test-file.txt']);
        
    } catch (error) {
        console.error("Storage Error:", error);
        alert(`❌ স্টোরেজ টেস্ট ব্যর্থ!\n${error.message}`);
    }
}

// Refresh all data
async function refreshAll() {
    await Promise.all([
        loadMaterials(),
        loadFileManagementTable(),
        loadStats()
    ]);
    
    alert("✅ সব ডাটা রিফ্রেশ করা হয়েছে!");
}

// ==============================
// UTILITY FUNCTIONS
// ==============================

// Mobile detection
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Request desktop view
function requestDesktop() {
    if(isMobile()) {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=1200');
        alert("ডেস্কটপ ভিউ চালু হয়েছে! পেজ রিফ্রেশ করুন।");
    }
}

// Initialize sample data (for testing)
async function initializeSampleData() {
    try {
        const { count, error } = await supabase
            .from('files')
            .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        if (count === 0) {
            const sampleData = [
                {
                    class: '6',
                    subject: 'bangla',
                    type: 'pdf',
                    name: 'ষষ্ঠ শ্রেণি বাংলা বই',
                    file_url: 'https://drive.google.com/uc?id=1abc123',
                    file_size: '2.5MB',
                    created_by: 'admin',
                    downloads: 15,
                    views: 60
                },
                {
                    class: '9',
                    subject: 'math',
                    type: 'video',
                    name: 'নবম শ্রেণি বীজগণিত',
                    file_url: 'https://youtube.com/embed/dQw4w9WgXcQ',
                    created_by: 'admin',
                    downloads: 30,
                    views: 150
                },
                {
                    class: '10',
                    subject: 'science',
                    type: 'image',
                    name: 'দশম শ্রেণি বিজ্ঞান ছবি',
                    file_url: 'https://via.placeholder.com/600x400?text=বিজ্ঞান+ছবি',
                    file_size: '1.2MB',
                    created_by: 'admin',
                    downloads: 8,
                    views: 45
                }
            ];
            
            await supabase.from('files').insert(sampleData);
            console.log("✅ স্যাম্পল ডাটা যোগ করা হয়েছে");
        }
    } catch (error) {
        console.error("Error initializing sample data:", error);
    }
}

// Call on first load
initializeSampleData();