import { AppService } from './app.service';
import { FileProcessingService } from './file-processing.service';
import { UtilityService } from './utility.service';

const Services = [AppService, FileProcessingService, UtilityService];

export { AppService, FileProcessingService, UtilityService };
export default Services;
