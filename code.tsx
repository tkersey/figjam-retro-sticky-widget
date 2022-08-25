const { widget } = figma;
const {
  AutoLayout,
  Image,
  Input,
  Text,
  useSyncedState,
  useSyncedMap,
  useEffect,
} = widget;

function RetroSticky() {
  const [fill, setFill] = useSyncedState("fill", "#cccccc");
  const [body, setBody] = useSyncedState("body", "");
  const [name, setName] = useSyncedState<string>("name", "");
  const [photoUrl, setPhotoUrl] = useSyncedState<string | null>(
    "photoUrl",
    null
  );
  const votesMap = useSyncedMap<number>("votes");
  const numVotes = votesMap.values().reduce((acc, x) => acc + x, 0);

  useEffect(() => {
    if (!name) {
      if (figma.currentUser) {
        setName(figma.currentUser.name);
        setPhotoUrl(figma.currentUser.photoUrl);
      } else {
        figma.notify("Please login to figma");
      }
    }
  });

  return (
    <AutoLayout
      width={256}
      direction={"vertical"}
      fill={fill}
      spacing={8}
      padding={8}
    >
      <Input
        fontFamily={"Roboto"}
        fontSize={14}
        value={body}
        onTextEditEnd={(textEditEvent) => {
          let contents = textEditEvent.characters.toLowerCase();

          if (contents.startsWith("i like")) setFill("#B8D245");
          if (contents.startsWith("i wish")) setFill("#EB9525");
          if (contents.startsWith("i wonder")) setFill("#FAD935");
          if (contents.startsWith("we will")) setFill("#25BBE5");

          setBody(textEditEvent.characters);
        }}
      />
      <AutoLayout width={"fill-parent"}>
        {photoUrl && (
          <Image
            width={22}
            height={22}
            src={photoUrl}
            stroke={"#666"}
            strokeWidth={1}
            tooltip={name}
          />
        )}
        <Text
          fontFamily={"Roboto"}
          fontSize={14}
          width={"fill-parent"}
          horizontalAlignText={"right"}
          onClick={() => {
            const voteKey = String(figma.currentUser?.sessionId);
            if (votesMap.get(voteKey) === 1) {
              votesMap.set(voteKey, 0);
            } else {
              votesMap.set(voteKey, 1);
            }
          }}
        >
          {numVotes}
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(RetroSticky);
