import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Suggestions from "./pages/Suggestions";
import JobMatches from "./pages/JobMatches";
import ChatAssistant from "./pages/ChatAssistant";
import History from "./pages/History";
import Navbar from "./components/Navbar";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/upload"
          element={
            <PageWrapper>
              <Upload />
            </PageWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />
        <Route
          path="/suggestions"
          element={
            <PageWrapper>
              <Suggestions />
            </PageWrapper>
          }
        />
        <Route
          path="/jobs"
          element={
            <PageWrapper>
              <JobMatches />
            </PageWrapper>
          }
        />
        <Route
          path="/chat"
          element={
            <PageWrapper>
              <ChatAssistant />
            </PageWrapper>
          }
        />
        <Route
          path="/history"
          element={
            <PageWrapper>
              <History />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-gray-950 text-white overflow-hidden">
      {!isLandingPage && <Navbar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {!isLandingPage && <Header />}
        <main
          className={`flex-1 overflow-y-auto p-6 ${isLandingPage ? "py-8" : ""}`}
        >
          <AnimatedRoutes />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
