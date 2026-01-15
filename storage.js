// Stub minimal pour sauvegarder les données (simulation)
class StorageService {
    constructor(googleSheetUrl) {
        this.url = googleSheetUrl;
    }

    async save(email, prize) {
        console.log(`💾 StorageService.save -> email=${email}, prize=${prize && prize.code}`);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            return { success: true };
        } catch (err) {
            return { success: false, error: err };
        }
    }
}

window.StorageService = StorageService;
