import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger("ExamVisionAI")


if __name__ == "__main__":
    logger.info("Logger initialized successfully.")