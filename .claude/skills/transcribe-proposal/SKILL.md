# transcribe-proposal

Convert meeting audio recordings into structured PPTX proposals using AI.

## Trigger

User says "transcribe proposal", "recording to proposal", provides an audio file path and asks for a proposal, or uses `/transcribe-proposal <audio-file>`.

## Required Info

1. **Audio file path** - mp3, m4a, wav, ogg, flac, mp4, webm

Optional (ask after transcription):
2. **Project name** - for folder naming
3. **Pricing range** - e.g., 12-15萬
4. **Include marketing** - system only or with marketing integration

## Workflow

### Step 1: Transcribe
```bash
npx transcribe-proposal <audio-file> --transcribe-only
```
Or if the CLI is installed globally, use it directly.

### Step 2: Analyze with AI
Read the transcript and extract:
1. Meeting background (who, what business)
2. Client needs (prioritized)
3. Proposed solutions
4. Key decisions and consensus
5. Action items
6. Business insights (value, reusability)

### Step 3: Create Project Files
In `projects/<project-name>/`:
- `README.md` - Project overview
- `consultation-notes.md` - Full consultation record

### Step 4: Confirm Direction
Ask user about:
- Pricing range
- Plan structure (basic/full)
- Marketing inclusion
- Payment terms

### Step 5: Generate PPTX
```bash
npx transcribe-proposal --transcript <path> --output output/<filename>.pptx
```

### Step 6: Update Context
- Add project to `context/current-priorities.md`
- Log decisions in `decisions/log.md`

## Quick Usage

```
/transcribe-proposal ~/Downloads/meeting.mp3
/transcribe-proposal ~/Downloads/meeting.mp3 報價15萬 含行銷
```
