// Stub — gamification system removed. Match game completion is tracked locally only.
export const useMatchGameGamification = () => {
    const submitMatchGameResult = async (_result: unknown) => null;
    return { submitMatchGameResult, isSubmitting: false };
};
