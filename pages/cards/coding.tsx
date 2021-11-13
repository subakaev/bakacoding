import { getLayout } from "components/layouts/CodingCardsLayout";
import { Button, Typography, Box, Alert } from "@mui/material";
import CodingCardsFilter from "components/coding-cards/CodingCardsFilter";
import {
  CodingCardsStateStatus,
  useCodingCardsContext,
} from "components/coding-cards/CodingCardsContext";
import { useRouter } from "next/router";

const CodingCards = () => {
  /*
  const [cardIds, setCardIds] = useState<string[]>([]);
  const [cardIndex, setCardIndex] = useState(-1);
  const [entry, setEntry] = useState<Entry<CodingCardFields> | null>(null);
  const [codingCard, setCodingCard] = useState<CodingCard | null>(null);
  const [saving, setSaving] = useState(false);

  const pickCard = async () => {
    const client = getContentfulClient();

    const cardId = cardIds[cardIndex];

    const entry = await client.getEntry<CodingCardFields>(cardId);

    console.log(entry);

    const response = await axios.get(`/api/coding-cards/${cardId}`);

    console.log("card");

    if (response.data != null) {
      setCodingCard(response.data);
    }

    setEntry(entry);

    setCardIndex((idx) => idx + 1);
  };

  const updateProgress = async (result: MemoryCardAttemptType) => {
    try {
      setSaving(true);
      if (codingCard == null) {
        const response = await axios.post("/api/coding-cards", {
          entryId: entry?.sys.id,
          result,
        });
      } else {
        const response = await axios.put(
          `/api/coding-cards/${codingCard._id}`,
          { result }
        );
      }
      setSaving(false);
      console.log("done");
    } catch {
      setSaving(false);
      console.log("error");
    }
  };

  const failedHandler = async () => {
    await updateProgress("failed");
  };

  const warningHandler = async () => {
    await updateProgress("warning");
  };

  const successHandler = async () => {
    await updateProgress("success");
  };*/

  const { state } = useCodingCardsContext();

  const router = useRouter();

  const studyClickHandler = () => {
    router.push(`/cards/${state.nextSlug}`);
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <CodingCardsFilter />
      <Box sx={{ pt: 3, textAlign: "center" }}>
        {state.status === CodingCardsStateStatus.Loaded && (
          // TODO display hurray message if no cards to study
          <>
            <Typography sx={{ pb: 2 }}>
              You have {state.slugs.length} cards to study
            </Typography>
            <Button
              onClick={studyClickHandler}
              variant="contained"
              size="large"
              disabled={state.slugs.length === 0}>
              Study
            </Button>
          </>
        )}

        {state.status === CodingCardsStateStatus.Error && (
          <Alert severity="error">An error occurred when loading cards</Alert>
        )}
      </Box>

      {/* {!!entry && (
        <Container maxWidth="xl">
          <Card>
            <CardHeader title={entry.fields.title} />
            <CardContent>
              <MarkdownText text={entry.fields.description} />
              <MuiLink href={entry.fields.link} target="_blank">
                Open
              </MuiLink>
              <Typography>Hints</Typography>
              {entry.fields.hints?.map((hint, index) => (
                <Accordion key={hint}>
                  <AccordionSummary>
                    <Typography>Show hint {index + 1}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{hint}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
              <Typography>Solutions</Typography>
              {entry.fields.solutions.map((solution) => (
                <Accordion key={solution.sys.id}>
                  <AccordionSummary>
                    <Typography>{solution.fields.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Time complexity: {solution.fields.timeComplexity}
                    </Typography>
                    <Typography>
                      Space complexity: {solution.fields.spaceComplexity}
                    </Typography>
                    <MarkdownText text={solution.fields.solution} />
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
            <CardActions>
              <Button onClick={failedHandler}>Fail</Button>
              <Button onClick={warningHandler}>Keep</Button>
              <Button onClick={successHandler}>Success</Button>
            </CardActions>
          </Card>
        </Container>
      )} */}
    </Box>
  );
};

CodingCards.getLayout = getLayout;

export default CodingCards;
