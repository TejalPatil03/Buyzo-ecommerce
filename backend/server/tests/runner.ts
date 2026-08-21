import { runCryptoTests } from './unit/crypto.test';
import { runServicesTests } from './unit/services.test';
import { runApiIntegrationTests } from './integration/api.test';

async function main() {
  console.log('====================================================');
  console.log('      BUYZO BACKEND AUTOMATED TEST SUITE           ');
  console.log('====================================================\n');

  try {
    await runCryptoTests();
    console.log('');
    await runServicesTests();
    console.log('');
    await runApiIntegrationTests();
    console.log('\n====================================================');
    console.log('      ALL TEST SUITES PASSED SUCCESSFULLY!          ');
    console.log('====================================================');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ TEST SUITE FAILED:', err.message || err);
    process.exit(1);
  }
}

main();
