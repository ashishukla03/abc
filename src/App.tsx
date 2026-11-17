import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './views/DashboardView';
import { ClassSubjectsView } from './views/ClassSubjectsView';
import { SubjectTimelineView } from './views/SubjectTimelineView';
import { InquiryLabView } from './views/InquiryLabView';
import { SchoolHubView } from './views/SchoolHubView';
import { MockExamsView } from './views/MockExamsView';
import { LearnerProfileView } from './views/LearnerProfileView';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="class/:classId/subjects" element={<ClassSubjectsView />} />
          <Route path="subject/:subjectId" element={<SubjectTimelineView />} />
          <Route path="lab/:topicId" element={<InquiryLabView />} />
          <Route path="hub" element={<SchoolHubView />} />
          <Route path="mock-exams" element={<MockExamsView />} />
          <Route path="profile" element={<LearnerProfileView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;

