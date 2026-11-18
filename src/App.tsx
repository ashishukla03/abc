import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './views/DashboardView';
import { ClassSubjectsView } from './views/ClassSubjectsView';
import { SubjectTimelineView } from './views/SubjectTimelineView';
import { InquiryLabView } from './views/InquiryLabView';
import { MockExamsView } from './views/MockExamsView';
import { SchoolHubView } from './views/SchoolHubView';
import { LearnerProfileView } from './views/LearnerProfileView';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardView />} />
          <Route path="courses" element={<ClassSubjectsView />} />
          <Route path="class/:classId/subjects" element={<ClassSubjectsView />} />
          <Route path="subject/:subjectId" element={<SubjectTimelineView />} />
          <Route path="lab/:topicId" element={<InquiryLabView />} />
          <Route path="exams" element={<MockExamsView />} />
          <Route path="school" element={<SchoolHubView />} />
          <Route path="profile" element={<LearnerProfileView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;
