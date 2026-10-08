let currentTool = 'social';

function selectTool(toolType) {
    currentTool = toolType;
    
    // Update button styles
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600/20', 'border-indigo-500/50', 'text-white', 'shadow-lg', 'shadow-indigo-500/10');
        btn.classList.add('bg-slate-900/60', 'border-slate-800', 'text-slate-400');
    });

    const activeBtn = document.getElementById(`btn-${toolType}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-slate-900/60', 'border-slate-800', 'text-slate-400');
        activeBtn.classList.add('bg-indigo-600/20', 'border-indigo-500/50', 'text-white', 'shadow-lg', 'shadow-indigo-500/10');
    }

    // Placeholders
    const placeholders = {
        social: 'উদাহরণ: একটি নতুন ফিটনেস জিমের জন্য আকর্ষণীয় ইনস্টাগ্রাম ও ফেসবুক পোস্ট লিখে দাও...',
        email: 'উদাহরণ: ক্লায়েন্টের কাছে কাজের আপডেট জানিয়ে একটি প্রফেশনাল ইমেইল তৈরি করো...',
        essay: 'উদাহরণ: জলবায়ু পরিবর্তনের প্রভাব এবং প্রতিকার নিয়ে একটি সহজ essay লিখে দাও...',
        cover_letter: 'উদাহরণ: ডিজিটাল মার্কেটিং ম্যানেজার পদের জন্য একটি চাকরি আবেদন কভার লেটার বানাও...'
    };

    document.getElementById('promptInput').placeholder = placeholders[toolType] || 'আপনি কী বিষয় নিয়ে লিখতে চান?';
}

function setPrompt(text) {
    document.getElementById('promptInput').value = text;
}

async function generateContent() {
    const prompt = document.getElementById('promptInput').value.trim();
    const language = document.getElementById('languageSelect').value;
    const generateBtn = document.getElementById('generateBtn');
    const resultBox = document.getElementById('resultBox');
    const outputContent = document.getElementById('outputContent');
    const wordCountBadge = document.getElementById('wordCountBadge');

    if (!prompt) {
        alert('অনুগ্রহ করে আপনি কী বিষয় নিয়ে লিখতে চান তা বক্সে লিখুন।');
        return;
    }

    // Loading State
    generateBtn.disabled = true;
    generateBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> <span>এআই চিন্তা করছে... অপেক্ষা করুন</span>`;
    
    resultBox.classList.remove('hidden');
    outputContent.innerHTML = `<div class="flex items-center justify-center py-8 text-indigo-400 space-x-3">
        <i class="fa-solid fa-sparkles text-xl animate-bounce"></i>
        <span class="text-sm font-medium">স্মার্ট এআই আপনার জন্য কন্টেন্ট তৈরি করছে...</span>
    </div>`;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt,
                toolType: currentTool,
                language
            })
        });

        const data = await response.json();

        if (data.success && data.result) {
            outputContent.textContent = data.result;
            // Count words
            const words = data.result.trim().split(/\s+/).length;
            wordCountBadge.textContent = `${words} শব্দ`;
        } else {
            outputContent.textContent = `ত্রুটি: ${data.error || 'কন্টেন্ট জেনারেট করতে ব্যর্থ হয়েছে।'}`;
        }
    } catch (err) {
        outputContent.textContent = `নেটওয়ার্ক ত্রুটি ঘটেছে: ${err.message}`;
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = `<span>⚡ এআই দিয়ে তৈরি করুন</span>`;
    }
}

function copyToClipboard() {
    const content = document.getElementById('outputContent').textContent;
    if (!content) return;

    navigator.clipboard.writeText(content).then(() => {
        const copyBtnText = document.getElementById('copyBtnText');
        copyBtnText.textContent = 'কপি হয়েছে! ✓';
        setTimeout(() => {
            copyBtnText.textContent = 'কপি করুন';
        }, 2000);
    });
}

function downloadAsText() {
    const content = document.getElementById('outputContent').textContent;
    if (!content) return;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `SmartScribe_AI_${Date.now()}.txt`;
    link.click();
}
