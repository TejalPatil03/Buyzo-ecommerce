import { Router } from 'express';
import { addressController } from '../../controllers/AddressController';
import { authMiddleware } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validator';
import { validateAddress } from '../../validators/addressValidators';

const router = Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => addressController.getAddresses(req, res, next));
router.get('/:id', (req, res, next) => addressController.getAddressById(req, res, next));
router.post('/', validateBody(validateAddress), (req, res, next) => addressController.createAddress(req, res, next));
router.put('/:id', (req, res, next) => addressController.updateAddress(req, res, next));
router.delete('/:id', (req, res, next) => addressController.deleteAddress(req, res, next));

export default router;
