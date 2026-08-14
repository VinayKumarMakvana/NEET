const fs = require('fs');
let mockPath = 'js/mock-engine.js';
let mockContent = fs.readFileSync(mockPath, 'utf8');

// We need to replace the synchronous initHierarchicalTest with an async one.
const oldInit = `initHierarchicalTest(params) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && !ClerkAuth.isAuthenticated()) {
      if (typeof ClerkAuth.openSignIn === 'function') {
        ClerkAuth.openSignIn();
      }
      return;
    }

    if (params.level >= 4) {
      const currentUser = ClerkAuth.getCurrentUser();
      const isPremium = currentUser && new Date(currentUser.subscriptionExpiry) > new Date();
      if (!isPremium) {
        if (typeof PaymentEngine !== 'undefined' && typeof PaymentEngine.openCheckoutModal === 'function') {
          PaymentEngine.openCheckoutModal();
        } else {
          alert('This test requires NEET OS Premium (Rs. 99/Year). Please upgrade.');
        }
        return;
      }
    }

    const {
      level = 1,
      testId = \`test_\${Date.now()}\`,
      title = 'NEET Practice Test',
      subjectCode = 'all',
      subjectsList = null,
      count = 10,
      attemptTarget = null,
      totalMarks = null,
      durationMinutes = 15,
      drillType = 'standard',
      topicTitle = null,
      chapterTitle = null,
      chapterId = null,
      mockNum = null
    } = params;

    const questions = typeof getQuestionsForHierarchicalTest === 'function' 
      ? getQuestionsForHierarchicalTest(params)
      : (typeof NEET_QUESTIONS !== 'undefined' ? NEET_QUESTIONS.slice(0, count) : []);

    const finalCount = questions.length || count;`;

// Escape the regex string safely for replacement
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Instead of strict string match which might fail due to whitespace, let's use a regex
const regex = /initHierarchicalTest\(params\)\s*\{[\s\S]*?const finalCount = questions\.length \|\| count;/;

const newInit = `async initHierarchicalTest(params) {
    if (typeof ClerkAuth !== 'undefined' && typeof ClerkAuth.isAuthenticated === 'function' && !ClerkAuth.isAuthenticated()) {
      if (typeof ClerkAuth.openSignIn === 'function') {
        ClerkAuth.openSignIn();
      }
      return;
    }

    if (params.level >= 4) {
      const currentUser = ClerkAuth.getCurrentUser();
      const isPremium = currentUser && new Date(currentUser.subscriptionExpiry) > new Date();
      if (!isPremium) {
        if (typeof PaymentEngine !== 'undefined' && typeof PaymentEngine.openCheckoutModal === 'function') {
          PaymentEngine.openCheckoutModal();
        } else {
          alert('This test requires NEET OS Premium (Rs. 99/Year). Please upgrade.');
        }
        return;
      }
    }

    const {
      level = 1,
      testId = \`test_\${Date.now()}\`,
      title = 'NEET Practice Test',
      subjectCode = 'all',
      subjectsList = null,
      count = 10,
      attemptTarget = null,
      totalMarks = null,
      durationMinutes = 15,
      drillType = 'standard',
      topicTitle = null,
      chapterTitle = null,
      chapterId = null,
      mockNum = null
    } = params;

    if (window.showToast) window.showToast('Generating AI Test Questions...', 2000);

    let questions = [];
    if (typeof getQuestionsForHierarchicalTest === 'function') {
      const res = getQuestionsForHierarchicalTest(params);
      if (res instanceof Promise) {
        questions = await res;
      } else {
        questions = res;
      }
    } else {
      questions = typeof NEET_QUESTIONS !== 'undefined' ? NEET_QUESTIONS.slice(0, count) : [];
    }

    const finalCount = questions.length || count;`;

if (mockContent.match(regex)) {
  mockContent = mockContent.replace(regex, newInit);
  fs.writeFileSync(mockPath, mockContent);
  console.log('Successfully made initHierarchicalTest async and fixed the Promise bug!');
} else {
  console.log('Regex did not match. Please verify the code structure.');
}
