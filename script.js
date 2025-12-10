// Global variables
let currentFile = null;
let currentText = '';
let analysisResults = {};

// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const fileType = document.getElementById('fileType');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');
const loadingSpinner = document.getElementById('loadingSpinner');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');

// Event Listeners
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', handleDragOver);
uploadArea.addEventListener('dragleave', handleDragLeave);
uploadArea.addEventListener('drop', handleDrop);
analyzeBtn.addEventListener('click', analyzeDocument);
clearBtn.addEventListener('click', clearDocument);
exportJsonBtn.addEventListener('click', exportAsJson);
exportCsvBtn.addEventListener('click', exportAsCsv);

// File handling functions
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        displayFileInfo(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file) {
        fileInput.files = e.dataTransfer.files;
        displayFileInfo(file);
    }
}

function displayFileInfo(file) {
    currentFile = file;

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileType.textContent = file.type || 'Unknown';

    fileInfo.style.display = 'block';
    uploadArea.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function clearDocument() {
    currentFile = null;
    currentText = '';
    analysisResults = {};
    fileInput.value = '';

    fileInfo.style.display = 'none';
    uploadArea.style.display = 'block';
    resultsSection.style.display = 'none';
}

// Document analysis functions
async function analyzeDocument() {
    if (!currentFile) return;

    showLoading(true);

    try {
        // Extract text from document
        currentText = await extractText(currentFile);

        // Perform analysis
        analysisResults = performAnalysis(currentText);

        // Display results
        displayResults(analysisResults);

        showLoading(false);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        showLoading(false);
        alert('Error analyzing document: ' + error.message);
    }
}

async function extractText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const content = e.target.result;

            // Handle different file types
            if (file.type.startsWith('image/')) {
                // For images, show preview and return basic info
                resolve(`[Image File: ${file.name}]\nThis is an image file. Text extraction from images requires OCR technology.`);
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                resolve(content);
            } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
                resolve(`[PDF File: ${file.name}]\nPDF text extraction requires additional libraries. Showing basic file information.`);
            } else {
                // Try to read as text
                resolve(content);
            }
        };

        reader.onerror = function() {
            reject(new Error('Error reading file'));
        };

        // Read based on file type
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    });
}

function performAnalysis(text) {
    const results = {};

    // Basic statistics
    results.wordCount = countWords(text);
    results.charCount = text.length;
    results.charCountNoSpaces = text.replace(/\s/g, '').length;
    results.sentenceCount = countSentences(text);
    results.paragraphCount = countParagraphs(text);

    // Advanced statistics
    results.readingTime = calculateReadingTime(results.wordCount);
    results.avgWordLength = calculateAverageWordLength(text);
    results.longestWord = findLongestWord(text);
    results.keywords = extractKeywords(text);

    // Additional metrics
    results.lineCount = text.split('\n').length;
    results.uniqueWords = countUniqueWords(text);

    return results;
}

function countWords(text) {
    const words = text.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length;
}

function countSentences(text) {
    const sentences = text.split(/[.!?]+/);
    return sentences.filter(s => s.trim().length > 0).length;
}

function countParagraphs(text) {
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.filter(p => p.trim().length > 0).length;
}

function calculateReadingTime(wordCount) {
    // Average reading speed: 200 words per minute
    const minutes = Math.ceil(wordCount / 200);
    return minutes;
}

function calculateAverageWordLength(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return 0;

    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    return Math.round((totalLength / words.length) * 10) / 10;
}

function findLongestWord(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return '-';

    return words.reduce((longest, current) =>
        current.length > longest.length ? current : longest
    );
}

function countUniqueWords(text) {
    const words = text.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
    const uniqueWords = new Set(words);
    return uniqueWords.size;
}

function extractKeywords(text, limit = 10) {
    // Common stop words to exclude
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
        'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
        'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
        'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
        'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
        'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
        'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);

    // Extract and count words
    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.has(word));

    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort by frequency and return top keywords
    const keywords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));

    return keywords;
}

function displayResults(results) {
    // Update statistics
    document.getElementById('wordCount').textContent = results.wordCount.toLocaleString();
    document.getElementById('charCount').textContent = results.charCount.toLocaleString();
    document.getElementById('sentenceCount').textContent = results.sentenceCount.toLocaleString();
    document.getElementById('paragraphCount').textContent = results.paragraphCount.toLocaleString();

    // Update analysis details
    document.getElementById('readingTime').textContent = `${results.readingTime} ${results.readingTime === 1 ? 'minute' : 'minutes'}`;
    document.getElementById('avgWordLength').textContent = `${results.avgWordLength} characters`;
    document.getElementById('longestWord').textContent = results.longestWord;

    // Display keywords
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = '';

    if (results.keywords.length > 0) {
        results.keywords.forEach(keyword => {
            const tag = document.createElement('div');
            tag.className = 'keyword-tag';
            tag.innerHTML = `
                ${keyword.word}
                <span class="keyword-count">${keyword.count}</span>
            `;
            keywordsList.appendChild(tag);
        });
    } else {
        keywordsList.innerHTML = '<p style="color: var(--text-secondary);">No keywords found</p>';
    }

    // Display document preview
    const preview = document.getElementById('documentPreview');

    if (currentFile.type.startsWith('image/')) {
        preview.innerHTML = `<img src="${currentText.split('\n')[0]}" alt="Document preview">`;
    } else {
        const previewText = currentText.length > 2000
            ? currentText.substring(0, 2000) + '...\n\n[Preview truncated - Full document is longer]'
            : currentText;
        preview.textContent = previewText;
    }
}

function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

// Export functions
function exportAsJson() {
    const exportData = {
        fileName: currentFile.name,
        fileSize: currentFile.size,
        fileType: currentFile.type,
        analysisDate: new Date().toISOString(),
        statistics: {
            wordCount: analysisResults.wordCount,
            characterCount: analysisResults.charCount,
            characterCountNoSpaces: analysisResults.charCountNoSpaces,
            sentenceCount: analysisResults.sentenceCount,
            paragraphCount: analysisResults.paragraphCount,
            lineCount: analysisResults.lineCount,
            uniqueWords: analysisResults.uniqueWords,
            readingTimeMinutes: analysisResults.readingTime,
            averageWordLength: analysisResults.avgWordLength,
            longestWord: analysisResults.longestWord
        },
        keywords: analysisResults.keywords,
        documentPreview: currentText.substring(0, 500)
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `analysis_${currentFile.name}_${Date.now()}.json`);
}

function exportAsCsv() {
    const csvRows = [
        ['Metric', 'Value'],
        ['File Name', currentFile.name],
        ['File Size', formatFileSize(currentFile.size)],
        ['File Type', currentFile.type],
        ['Analysis Date', new Date().toLocaleString()],
        ['Word Count', analysisResults.wordCount],
        ['Character Count', analysisResults.charCount],
        ['Character Count (No Spaces)', analysisResults.charCountNoSpaces],
        ['Sentence Count', analysisResults.sentenceCount],
        ['Paragraph Count', analysisResults.paragraphCount],
        ['Line Count', analysisResults.lineCount],
        ['Unique Words', analysisResults.uniqueWords],
        ['Reading Time (minutes)', analysisResults.readingTime],
        ['Average Word Length', analysisResults.avgWordLength],
        ['Longest Word', analysisResults.longestWord],
        [''],
        ['Top Keywords', 'Frequency']
    ];

    analysisResults.keywords.forEach(keyword => {
        csvRows.push([keyword.word, keyword.count]);
    });

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `analysis_${currentFile.name}_${Date.now()}.csv`);
}

function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
console.log('Document Analysis Tool initialized');
