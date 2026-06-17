import { Router, type IRouter } from "express";
import healthRouter from "./health";
import systemsRouter from "./systems";
import articlesRouter from "./articles";
import legalTermsRouter from "./legalTerms";
import faqRouter from "./faq";
import quizRouter from "./quiz";
import aiRouter from "./ai";
import searchRouter from "./search";

const router: IRouter = Router();

router.use(healthRouter);
router.use(systemsRouter);
router.use(articlesRouter);
router.use(legalTermsRouter);
router.use(faqRouter);
router.use(quizRouter);
router.use(aiRouter);
router.use(searchRouter);

export default router;
