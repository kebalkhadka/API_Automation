import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export interface ExecutionSummary {
  name: string;
  status: 'PASSED' | 'FAILED';
  oldStatus?: number;
  newStatus?: number;
  durationOld?: number;
  durationNew?: number;
  errors?: string;
}

class CustomConsolidatedReporter implements Reporter {
  private summaries: ExecutionSummary[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    const name = test.title;
    const status = result.status === 'passed' ? 'PASSED' : 'FAILED';
    
    // Attempt parsing structured annotations attached inside test execution contexts
    const metaAnnotation = test.annotations.find(a => a.type === 'comparison_meta');
    const metadata = metaAnnotation?.description ? JSON.parse(metaAnnotation.description) : {};

    this.summaries.push({
      name,
      status,
      oldStatus: metadata.oldStatus,
      newStatus: metadata.newStatus,
      durationOld: metadata.durationOld,
      durationNew: metadata.durationNew,
      errors: result.errors.map(e => e.message).join(' | ') || undefined
    });
  }

  async onEnd() {
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const total = this.summaries.length;
    const passed = this.summaries.filter(s => s.status === 'PASSED').length;
    const failed = total - passed;

    // 1. Write High-density Console Summary Matrix
    console.log('\n======================================================');
    console.log('              API REGRESSION EXECUTION SUMMARY        ');
    console.log('======================================================');
    console.log(` TOTAL APIs PROCESSED : ${total}`);
    console.log(` \x1b[32mPASSED              : ${passed}\x1b[0m`);
    console.log(` \x1b[31mFAILED              : ${failed}\x1b[0m`);
    console.log('======================================================\n');

    // 2. Output CSV Stream
    const csvRows = [
      'API Name,Status,Old Status,New Status,Old Duration(ms),New Duration(ms),Errors'
    ];
    for (const s of this.summaries) {
      csvRows.push(
        `"${s.name.replace(/"/g, '""')}","${s.status}",${s.oldStatus || ''},${s.newStatus || ''},${s.durationOld || ''},${s.durationNew || ''},"${(s.errors || '').replace(/"/g, '""')}"`
      );
    }
    fs.writeFileSync(path.join(reportsDir, 'comparison-report.csv'), csvRows.join('\n'), 'utf-8');
  }
}

export default CustomConsolidatedReporter;