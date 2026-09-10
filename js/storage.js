(function () {
  const STORAGE_KEY = "taiwanEnglishMission.challengeHistory";
  const PROGRESS_KEY = "taiwanEnglishMission.mission01Progress";
  const emptyProgress = () => ({ coreMasteredScenarioIds: [], extensionMasteredScenarioIds: [], extensionUnlocked: false, fullSimulationUnlocked: false, fullSimulationAttempts: 0, lastFullSimulationScenarioIds: [] });

  function getHistory() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const history = saved ? JSON.parse(saved) : [];
      return Array.isArray(history) ? history : [];
    } catch (error) {
      return [];
    }
  }

  function saveChallenge(challenge) {
    const history = getHistory();
    history.push(challenge);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function getProgress() {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      const progress = saved ? JSON.parse(saved) : emptyProgress();
      return {
        coreMasteredScenarioIds: Array.isArray(progress.coreMasteredScenarioIds) ? [...new Set(progress.coreMasteredScenarioIds)] : [],
        extensionMasteredScenarioIds: Array.isArray(progress.extensionMasteredScenarioIds) ? [...new Set(progress.extensionMasteredScenarioIds)] : [],
        extensionUnlocked: Boolean(progress.extensionUnlocked), fullSimulationUnlocked: Boolean(progress.fullSimulationUnlocked),
        fullSimulationAttempts: Number.isInteger(progress.fullSimulationAttempts) ? progress.fullSimulationAttempts : 0,
        lastFullSimulationScenarioIds: Array.isArray(progress.lastFullSimulationScenarioIds) ? progress.lastFullSimulationScenarioIds : []
      };
    } catch (error) { return emptyProgress(); }
  }
  function saveProgress(progress) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
  function updateProgress({ coreIds = [], extensionIds = [], allCoreIds = [], allExtensionIds = [] }) {
    const progress = getProgress();
    progress.coreMasteredScenarioIds = [...new Set([...progress.coreMasteredScenarioIds, ...coreIds])];
    progress.extensionMasteredScenarioIds = [...new Set([...progress.extensionMasteredScenarioIds, ...extensionIds])];
    progress.extensionUnlocked = progress.extensionUnlocked || allCoreIds.every(id => progress.coreMasteredScenarioIds.includes(id));
    progress.fullSimulationUnlocked = progress.fullSimulationUnlocked || (progress.extensionUnlocked && allExtensionIds.every(id => progress.extensionMasteredScenarioIds.includes(id)));
    saveProgress(progress); return progress;
  }
  function saveFullSimulationAttempt(scenarioIds) {
    const progress = getProgress();
    progress.fullSimulationAttempts += 1;
    progress.lastFullSimulationScenarioIds = [...scenarioIds];
    saveProgress(progress); return progress;
  }

  window.missionStorage = { getHistory, saveChallenge, getProgress, updateProgress, saveFullSimulationAttempt };
})();
